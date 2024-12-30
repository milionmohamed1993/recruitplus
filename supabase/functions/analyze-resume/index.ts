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
                "overallEvaluation": {
                  "rating": "Note von 1-6 (1 ist die beste Bewertung)",
                  "summary": "Zusammenfassende Bewertung in 2-3 Sätzen",
                  "recommendationLevel": "Stark empfohlen/Empfohlen/Neutral/Nicht empfohlen"
                },
                "detailedAnalysis": {
                  "performanceMetrics": {
                    "qualityOfWork": "Bewertung der Arbeitsqualität",
                    "efficiency": "Bewertung der Effizienz",
                    "reliability": "Bewertung der Zuverlässigkeit",
                    "initiative": "Bewertung der Eigeninitiative"
                  },
                  "socialSkills": {
                    "teamwork": "Bewertung der Teamfähigkeit",
                    "communication": "Bewertung der Kommunikationsfähigkeit",
                    "leadership": "Bewertung der Führungsqualitäten falls relevant"
                  }
                },
                "keyPhrases": {
                  "positive": ["Liste positiver Schlüsselphrasen"],
                  "neutral": ["Liste neutraler Schlüsselphrasen"],
                  "negative": ["Liste negativer Schlüsselphrasen"]
                },
                "context": {
                  "duration": "Beschäftigungsdauer",
                  "position": "Position/Rolle",
                  "responsibilities": ["Hauptverantwortlichkeiten"],
                  "specialAchievements": ["Besondere Leistungen oder Projekte"]
                }
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