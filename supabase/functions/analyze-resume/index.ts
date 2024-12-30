import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, workReference, pdfImages, candidateId } = await req.json();
    console.log('Analyzing resume text length:', text.length);
    console.log('Number of PDF images:', pdfImages?.length);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle profile photo if available
    let profilePhotoUrl = null;
    if (pdfImages && pdfImages.length > 0) {
      try {
        const imageData = pdfImages[0];
        const buffer = Uint8Array.from(atob(imageData.replace(/^data:image\/\w+;base64,/, '')), c => c.charCodeAt(0));
        
        const fileName = `profile-${candidateId}-${Date.now()}.png`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(fileName, buffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.error('Error uploading profile photo:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('attachments')
            .getPublicUrl(fileName);
          
          profilePhotoUrl = publicUrl;

          // Update candidate with profile photo URL
          const { error: updateError } = await supabase
            .from('candidates')
            .update({ profile_photo_url: publicUrl })
            .eq('id', candidateId);

          if (updateError) {
            console.error('Error updating candidate profile photo:', updateError);
          }
        }
      } catch (imageError) {
        console.error('Error processing profile photo:', imageError);
      }
    }

    const resumeSystemPrompt = `Du bist ein Experte im Analysieren von Lebensläufen. 
    Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie exakt wie folgt.
    Wichtig: Entferne alle Kommas aus den Werten und gib nur die angeforderten Felder zurück.
    
    Extrahiere auch:
    - Die letzten 3 Arbeitspositionen mit genauen Daten
    - Die letzten 3 Bildungseinrichtungen/Ausbildungen mit genauen Daten
    - Eine Liste von maximal 20 relevanten Skills als Tags
    
    WICHTIG: Gib deine Antwort NUR als valides JSON zurück ohne zusätzlichen Text davor oder danach.
    
    {
      "personalInfo": {
        "name": "Vollständiger Name ohne Titel",
        "email": "Email-Adresse",
        "phone": "Telefonnummer ohne Formatierung",
        "birthdate": "Datum im Format YYYY-MM-DD",
        "address": "Vollständige Adresse in einer Zeile",
        "nationality": "Nationalität",
        "location": "Stadt"
      },
      "professionalInfo": {
        "position": "Aktuelle Position",
        "company": "Firmenname",
        "department": "Abteilung",
        "industry": "Branche",
        "experience": "Berufserfahrung in Jahren (nur Zahl)"
      },
      "workHistory": [
        {
          "position": "Position",
          "company": "Firma",
          "startDate": "YYYY-MM-DD",
          "endDate": "YYYY-MM-DD oder null wenn aktuell",
          "isCurrent": true/false,
          "description": "Beschreibung der Tätigkeit"
        }
      ],
      "education": {
        "degree": "Höchster Abschluss",
        "university": "Name der Universität",
        "educationHistory": [
          {
            "institution": "Name der Institution",
            "degree": "Art des Abschlusses",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD",
            "fieldOfStudy": "Studienfach/Fachrichtung"
          }
        ]
      },
      "skills": [
        "Skill1",
        "Skill2"
      ]
    }`;

    const resumeResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: resumeSystemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!resumeResponse.ok) {
      const errorData = await resumeResponse.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${resumeResponse.status}`);
    }

    const resumeData = await resumeResponse.json();
    let parsedContent;
    try {
      parsedContent = JSON.parse(resumeData.choices[0].message.content.trim());
      
      // Add education entries to database
      if (parsedContent.education?.educationHistory) {
        for (const edu of parsedContent.education.educationHistory) {
          const { error: eduError } = await supabase
            .from('candidate_education')
            .insert({
              candidate_id: candidateId,
              institution: edu.institution,
              degree: edu.degree,
              field_of_study: edu.fieldOfStudy,
              start_date: edu.startDate,
              end_date: edu.endDate
            });

          if (eduError) {
            console.error('Error inserting education:', eduError);
          }
        }
      }
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', resumeData.choices[0].message.content);
      throw new Error('Failed to parse the resume data structure');
    }

    // Add profile photo URL to the response
    parsedContent = {
      ...parsedContent,
      profilePhotoUrl
    };

    return new Response(JSON.stringify({
      result: parsedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});