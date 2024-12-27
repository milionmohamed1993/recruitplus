import { toast } from "@/components/ui/use-toast";

export async function parseResume(file: File, text: string) {
  try {
    if (file.type === 'application/pdf') {
      toast({
        title: "PDF-Format nicht unterstützt",
        description: "PDF-Dateien werden derzeit nicht unterstützt. Bitte kopieren Sie den Inhalt manuell in das Textfeld.",
        variant: "destructive"
      });
      return null;
    }

    if (!file.type.includes('document')) {
      toast({
        title: "Ungültiges Dateiformat",
        description: "Bitte laden Sie eine .doc oder .docx Datei hoch.",
        variant: "destructive"
      });
      return null;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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
    toast({
      title: "Fehler beim Analysieren",
      description: "Beim Analysieren des Lebenslaufs ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder geben Sie die Informationen manuell ein.",
      variant: "destructive"
    });
    return null;
  }
}