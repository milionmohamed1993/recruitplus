import { supabase } from "@/lib/supabase";

export async function parseResume(file: File, text: string, apiKey: string) {
  try {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Bitte laden Sie eine PDF, .doc oder .docx Datei hoch');
    }

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Invalid API key format');
    }

    console.log('Starting resume analysis with text length:', text.length);

    const systemPrompt = `Du bist ein Experte im Analysieren von Lebensläufen. 
    Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie strukturiert:
    
    - Persönliche Informationen:
      - Vollständiger Name
      - E-Mail
      - Telefonnummer
      - Geburtsdatum (falls verfügbar)
      - Adresse (falls verfügbar)
      - Nationalität (falls verfügbar)
      - Standort/Wohnort
    
    - Berufliche Informationen:
      - Aktuelle/Letzte Position
      - Firma
      - Abteilung
      - Branche
      - Berufserfahrung in Jahren
    
    - Ausbildung:
      - Höchster Abschluss
      - Universität/Institution
    
    Gib die Informationen in diesem exakten JSON-Format zurück:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "birthdate": "",
        "address": "",
        "nationality": "",
        "location": ""
      },
      "professionalInfo": {
        "position": "",
        "company": "",
        "department": "",
        "industry": "",
        "experience": ""
      },
      "education": {
        "degree": "",
        "university": ""
      }
    }`;

    console.log('Sending request to OpenAI...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Changed from gpt-4o-mini to gpt-4
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
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI Response received:', data);

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Unexpected response format from OpenAI');
    }

    try {
      const parsedContent = JSON.parse(data.choices[0].message.content);
      console.log('Successfully parsed resume data:', parsedContent);
      return data.choices[0].message.content;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse the resume data structure');
    }
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}