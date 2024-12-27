import { supabase } from "@/lib/supabase";

export async function parseResume(file: File, text: string, apiKey: string) {
  try {
    // Validate file type
    if (!file.type.includes('document')) {
      throw new Error('Bitte laden Sie eine .doc oder .docx Datei hoch');
    }

    // Validate API key format
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Invalid API key format');
    }

    console.log('Starting resume analysis with file:', file.name);

    const systemPrompt = `Extract the following information from this resume in a structured format:
      - Personal Information:
        - Full Name
        - Email
        - Phone Number
        - Location
        - Nationality (if available)
      - Professional Information:
        - Current/Latest Position
        - Company
        - Years of Experience
        - Key Skills
        - Industry
      - Education:
        - Degree
        - University/Institution
        - Graduation Year
      
      Return the information in valid JSON format with these exact keys:
      {
        "personalInfo": {
          "name": "",
          "email": "",
          "phone": "",
          "location": "",
          "nationality": ""
        },
        "professionalInfo": {
          "position": "",
          "company": "",
          "experience": "",
          "skills": [],
          "industry": ""
        },
        "education": {
          "degree": "",
          "university": "",
          "graduationYear": ""
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
        model: "gpt-4",
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
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI Response:', data);

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