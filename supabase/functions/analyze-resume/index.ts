import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    console.log('Analyzing resume text length:', text.length);

    const systemPrompt = `Du bist ein Experte im Analysieren von Lebensläufen. 
    Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie exakt wie folgt.
    Wichtig: Entferne alle Kommas aus den Werten und gib nur die angeforderten Felder zurück.

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
      }
    }

    Wichtige Hinweise:
    - Entferne ALLE Kommas aus den Werten
    - Verwende keine Aufzählungszeichen oder Listenpunkte
    - Gib nur die Werte zurück die im Text gefunden wurden
    - Lasse nicht gefundene Werte leer ("")
    - Formatiere Datumsangaben immer als YYYY-MM-DD
    - Bei der Berufserfahrung gib nur die Zahl der Jahre an`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: systemPrompt,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Unexpected response format from OpenAI');
    }

    // Parse and clean the response
    let parsedContent;
    try {
      const cleanContent = data.choices[0].message.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      parsedContent = JSON.parse(cleanContent);
      
      // Clean up the parsed data
      const cleanValue = (value: string) => {
        if (!value) return "";
        return value
          .replace(/,/g, '') // Remove all commas
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .trim();
      };

      // Clean personal info
      Object.keys(parsedContent.personalInfo).forEach(key => {
        parsedContent.personalInfo[key] = cleanValue(parsedContent.personalInfo[key]);
      });

      // Clean professional info
      Object.keys(parsedContent.professionalInfo).forEach(key => {
        parsedContent.professionalInfo[key] = cleanValue(parsedContent.professionalInfo[key]);
      });

      // Clean education info
      Object.keys(parsedContent.education).forEach(key => {
        parsedContent.education[key] = cleanValue(parsedContent.education[key]);
      });

      console.log('Successfully cleaned and parsed resume data');
    } catch (error) {
      console.error('Error parsing or cleaning response:', error);
      throw new Error('Failed to parse the resume data structure');
    }

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