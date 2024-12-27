import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { ResumeProgressDialog } from "./ResumeProgressDialog";
import { ResumeUploadButton } from "./ResumeUploadButton";
import { extractTextFromPDF } from "@/utils/pdfExtractor";

interface ResumeUploadProps {
  onResumeAnalyzed: (data: any) => void;
}

export function ResumeUpload({ onResumeAnalyzed }: ResumeUploadProps) {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        setIsAnalyzing(true);
        setProgress(10);
        setProgressStatus("Datei wird hochgeladen...");

        console.log('Starting file processing...');
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error('Failed to upload file to storage');
        }

        setProgress(30);
        setProgressStatus("Datei wird verarbeitet...");
        console.log("File uploaded successfully:", uploadData);

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        console.log("Public URL generated:", publicUrl);

        const response = await fetch(publicUrl);
        const arrayBuffer = await response.arrayBuffer();

        setProgress(50);
        setProgressStatus("Text wird extrahiert...");

        let extractedText: string;
        if (selectedFile.type === 'application/pdf') {
          console.log("Processing PDF file...");
          extractedText = await extractTextFromPDF(arrayBuffer);
        } else {
          extractedText = await new Response(arrayBuffer).text();
        }

        setResume(extractedText);
        console.log('Text extracted:', extractedText.substring(0, 100) + '...');
        
        setProgress(70);
        setProgressStatus("Lebenslauf wird analysiert...");
        await analyzeResume(extractedText);
      } catch (error: any) {
        console.error("Error reading file:", error);
        toast({
          title: "Fehler beim Lesen der Datei",
          description: error.message || "Die Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
        setProgress(0);
        setProgressStatus("");
      }
    }
  };

  const analyzeResume = async (text?: string) => {
    const textToAnalyze = text || resume;
    
    if (!file || !textToAnalyze) {
      toast({
        title: "Fehler",
        description: "Bitte laden Sie einen Lebenslauf hoch oder fügen Sie den Text ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting resume analysis...');
      const { data: { OPENAI_API_KEY } } = await supabase
        .from('secrets')
        .select('OPENAI_API_KEY')
        .single();

      if (!OPENAI_API_KEY) {
        toast({
          title: "API-Schlüssel fehlt",
          description: "Bitte fügen Sie den OpenAI API-Schlüssel in den Projekteinstellungen hinzu.",
          variant: "destructive",
        });
        return;
      }

      setProgress(85);
      setProgressStatus("KI-Analyse wird durchgeführt...");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
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
              }`
            },
            {
              role: "user",
              content: textToAnalyze
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
      console.log('OpenAI Response received:', data);

      if (!data.choices?.[0]?.message?.content) {
        console.error('Unexpected OpenAI response format:', data);
        throw new Error('Unexpected response format from OpenAI');
      }

      try {
        const parsedData = JSON.parse(data.choices[0].message.content);
        console.log('Successfully parsed resume data:', parsedData);
        setProgress(100);
        setProgressStatus("Analyse abgeschlossen!");
        onResumeAnalyzed(parsedData);
        toast({
          title: "Analyse erfolgreich",
          description: "Der Lebenslauf wurde erfolgreich analysiert.",
        });
      } catch (parseError) {
        console.error('Error parsing OpenAI response:', parseError);
        throw new Error('Failed to parse the resume data structure');
      }
    } catch (error: any) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Fehler bei der Analyse",
        description: error.message || "Der Lebenslauf konnte nicht analysiert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ResumeProgressDialog
        isOpen={isAnalyzing}
        progress={progress}
        status={progressStatus}
      />

      <ResumeUploadButton
        onFileSelect={handleFileChange}
        file={file}
      />

      <Textarea
        placeholder="Fügen Sie hier den Lebenslauf ein..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        className="h-64"
      />

      {resume && (
        <Button
          type="button"
          onClick={() => analyzeResume()}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
        </Button>
      )}
    </div>
  );
}