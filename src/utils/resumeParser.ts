export async function parseResume(file: File, text: string, apiKey: string) {
  try {
    if (file.type === 'application/pdf') {
      throw new Error('PDF-Format wird derzeit nicht unterstützt');
    }

    if (!file.type.includes('document')) {
      throw new Error('Bitte laden Sie eine .doc oder .docx Datei hoch');
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Extract the following information from this resume in a structured format:
              - Personal Information (name, email, phone, birthdate, address, nationality, location)
              - Professional Information (current position, company, department, industry, years of experience)
              - Education (degree, university, graduation date)
              Please return the information in a JSON format.`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}