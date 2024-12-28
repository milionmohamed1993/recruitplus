import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, workReference } = await req.json();
    console.log('Analyzing resume text length:', text.length);
    console.log('Work reference provided:', !!workReference);

    const resumeSystemPrompt = `Du bist ein Experte im Analysieren von Lebensläufen. 
    Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie exakt wie folgt.
    Wichtig: Entferne alle Kommas aus den Werten und gib nur die angeforderten Felder zurück.
    
    Analysiere den Lebenslauf sehr detailliert und erstelle eine umfassende Bewertung des Kandidaten.
    Berücksichtige dabei:
    - Fachliche Expertise und spezifische technische Fähigkeiten
    - Bildungsweg und akademische Leistungen
    - Berufserfahrung und Verantwortungsbereiche
    - Soft Skills und Führungskompetenzen
    - Besondere Erfolge und Projekte
    - Entwicklungspotenzial
    
    Erstelle auch quantitative Metriken (1-10) für:
    - Technische Expertise
    - Führungskompetenz
    - Projekterfahrung
    - Kommunikationsfähigkeit
    - Bildungsniveau
    
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
      "education": {
        "degree": "Höchster Abschluss",
        "university": "Name der Universität",
        "graduationYear": "Abschlussjahr",
        "academicPerformance": "Beschreibung der akademischen Leistungen",
        "additionalCertifications": ["Zertifikat1", "Zertifikat2"]
      },
      "skills": [
        "Skill1",
        "Skill2"
      ],
      "detailedAnalysis": {
        "technicalExpertise": "Detaillierte Beschreibung der technischen Fähigkeiten und Erfahrungen",
        "projectExperience": "Beschreibung wichtiger Projekte und Erfolge",
        "leadershipSkills": "Einschätzung der Führungskompetenzen",
        "communicationSkills": "Bewertung der Kommunikationsfähigkeiten",
        "developmentPotential": "Einschätzung des Entwicklungspotenzials"
      },
      "metrics": {
        "technicalExpertise": "Bewertung 1-10",
        "leadershipCompetency": "Bewertung 1-10",
        "projectExperience": "Bewertung 1-10",
        "communicationSkills": "Bewertung 1-10",
        "educationLevel": "Bewertung 1-10"
      },
      "overallAssessment": "Zusammenfassende Gesamtbewertung des Kandidaten in 3-4 Sätzen"
    }`;

    const resumeResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
    console.log('Raw OpenAI response:', resumeData.choices[0].message.content);
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(resumeData.choices[0].message.content.trim());
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw content:', resumeData.choices[0].message.content);
      throw new Error('Failed to parse the resume data structure');
    }

    // If work reference is provided, analyze it
    let workReferenceEvaluation = "";
    if (workReference) {
      const workRefResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Du bist ein Experte im Analysieren von deutschen Arbeitszeugnissen.
              Analysiere das folgende Arbeitszeugnis und gib eine detaillierte Einschätzung.
              Berücksichtige dabei die typische "Geheimsprache" in deutschen Arbeitszeugnissen.
              
              WICHTIG: Gib deine Antwort NUR als valides JSON zurück ohne zusätzlichen Text davor oder danach.
              
              {
                "evaluation": "Deine detaillierte Einschätzung des Arbeitszeugnisses in 2-3 Sätzen",
                "rating": "Note von 1-6 (1 ist die beste Bewertung)",
                "keywords": ["Schlüsselwörter", "aus", "dem", "Zeugnis"]
              }`,
            },
            {
              role: "user",
              content: workReference,
            },
          ],
          temperature: 0.3,
        }),
      });

      if (!workRefResponse.ok) {
        console.error('Error analyzing work reference:', await workRefResponse.text());
        workReferenceEvaluation = "Fehler bei der Analyse des Arbeitszeugnisses";
      } else {
        const workRefData = await workRefResponse.json();
        try {
          const parsedWorkRef = JSON.parse(workRefData.choices[0].message.content.trim());
          workReferenceEvaluation = JSON.stringify(parsedWorkRef);
        } catch (parseError) {
          console.error('Error parsing work reference response:', parseError);
          console.error('Raw work ref content:', workRefData.choices[0].message.content);
          workReferenceEvaluation = "Fehler beim Parsen der Arbeitszeugnis-Analyse";
        }
      }
    }

    // Add work reference evaluation to the response
    parsedContent = {
      ...parsedContent,
      workReferenceEvaluation,
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