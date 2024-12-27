import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { parseResume } from "@/utils/resumeParser";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).href;

interface ResumeUploadProps {
  onResumeAnalyzed: (data: any) => void;
}

export function ResumeUpload({ onResumeAnalyzed }: ResumeUploadProps) {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error('Failed to upload file to storage');
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        // Download and parse the PDF
        const response = await fetch(publicUrl);
        const arrayBuffer = await response.arrayBuffer();

        if (selectedFile.type === 'application/pdf') {
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          const cleanText = fullText
            .replace(/\s+/g, ' ')
            .trim();
          setResume(cleanText);
          console.log('PDF text extracted successfully');
        } else {
          // For other file types use FileReader
          const text = await new Response(arrayBuffer).text();
          setResume(text);
        }
        console.log('File loaded successfully:', selectedFile.name);
      } catch (error) {
        console.error("Error reading file:", error);
        toast({
          title: "Fehler beim Lesen der Datei",
          description: "Die Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeResume = async () => {
    if (!file || !resume) {
      toast({
        title: "Fehler",
        description: "Bitte laden Sie einen Lebenslauf hoch oder fügen Sie den Text ein.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
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

      const parsedData = await parseResume(file, resume, OPENAI_API_KEY);
      if (parsedData) {
        const jsonData = JSON.parse(parsedData);
        console.log('Resume parsed successfully:', jsonData);
        onResumeAnalyzed(jsonData);
        toast({
          title: "Analyse erfolgreich",
          description: "Der Lebenslauf wurde erfolgreich analysiert.",
        });
      }
    } catch (error: any) {
      console.error("Error parsing resume:", error);
      toast({
        title: "Fehler bei der Analyse",
        description: error.message || "Der Lebenslauf konnte nicht analysiert werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Lebenslauf hochladen
        </Button>
        <input
          id="resume-upload"
          type="file"
          className="hidden"
          accept=".doc,.docx,.pdf"
          onChange={handleFileChange}
        />
        {file && (
          <span className="text-sm text-muted-foreground">
            {file.name}
          </span>
        )}
      </div>
      <Textarea
        placeholder="Fügen Sie hier den Lebenslauf ein..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
        className="h-64"
      />
      {resume && (
        <Button
          type="button"
          onClick={analyzeResume}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
        </Button>
      )}
    </div>
  );
}