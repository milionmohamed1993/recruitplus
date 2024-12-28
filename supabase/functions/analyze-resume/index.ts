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

    // First, analyze the resume
    const resumeSystemPrompt = `Du bist ein Experte im Analysieren von Lebensläufen. 
    Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie exakt wie folgt.
    Wichtig: Entferne alle Kommas aus den Werten und gib nur die angeforderten Felder zurück.
    Extrahiere auch eine Liste von maximal 20 relevanten Skills als Tags.

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
        "university": "Name der Universität"
      },
      "skills": ["Skill1", "Skill2", "..."] // Maximal 20 relevante Skills
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
    let parsedContent = JSON.parse(resumeData.choices[0].message.content);

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
              content: `Du bist ein Experte im Analysieren von Arbeitszeugnissen.
              Gib eine kurze Einschätzung des Arbeitszeugnisses ab und bewerte die Leistung des Mitarbeiters.
              Berücksichtige dabei die typische "Geheimsprache" in deutschen Arbeitszeugnissen.
              Fasse deine Analyse in 2-3 Sätzen zusammen.`,
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
        workReferenceEvaluation = workRefData.choices[0].message.content;
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