import { supabase } from "@/lib/supabase";

export async function analyzeResumeWithGPT(text: string) {
  try {
    console.log('Starting resume analysis...');
    
    // Fetch the API key from Supabase secrets
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (secretError) {
      console.error('Error fetching OpenAI API key:', secretError);
      throw new Error(`Failed to fetch OpenAI API key: ${secretError.message}`);
    }

    if (!secretData?.value) {
      console.error('No API key found in secrets');
      throw new Error('OpenAI API key not found in secrets');
    }

    const apiKey = secretData.value.trim();
    
    // Validate API key format
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid API key format');
      throw new Error('Invalid OpenAI API key format. The key should start with "sk-"');
    }

    console.log('Making request to OpenAI API...');
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Du bist ein Experte im Analysieren von Lebensläufen. 
            Extrahiere die folgenden Informationen aus diesem Lebenslauf und formatiere sie als JSON:
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
            }`
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
      const errorText = await response.text();
      console.error('OpenAI API Error Response:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    // Clone the response before reading it
    const responseClone = response.clone();
    
    try {
      const data = await response.json();
      console.log('OpenAI API response received successfully');
      return JSON.stringify(JSON.parse(data.choices[0].message.content));
    } catch (parseError) {
      // If JSON parsing fails, try to get the raw text from the cloned response
      const rawText = await responseClone.text();
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw response:', rawText);
      throw new Error('Failed to parse OpenAI response');
    }
  } catch (error) {
    console.error('Error in analyzeResumeWithGPT:', error);
    throw error;
  }
}