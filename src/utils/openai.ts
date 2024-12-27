import { supabase } from "@/lib/supabase";

export async function analyzeResumeWithGPT(text: string) {
  try {
    // Fetch the API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (secretError) {
      console.error('Error fetching OpenAI API key:', secretError);
      throw new Error('Failed to fetch OpenAI API key');
    }

    if (!secretData?.value) {
      console.error('OpenAI API key not found in Supabase secrets');
      throw new Error('OpenAI API key not found in secrets');
    }

    console.log('Making request to OpenAI API...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretData.value}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Du bist ein Experte im Analysieren von Lebensläufen. 
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
              - Universität/Institution`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in analyzeResumeWithGPT:', error);
    throw error;
  }
}