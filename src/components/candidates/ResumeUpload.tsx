import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { parseResume } from "@/utils/resumeParser";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import * as pdfjsLib from 'pdfjs-dist';

// Use the correct version number that matches our installed package
const pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

console.log('PDF.js version:', pdfjsLib.version);
console.log('Worker URL:', pdfWorkerSrc);

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
        console.log('Starting file processing...');
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}_${selectedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error('Failed to upload file to storage');
        }

        console.log("File uploaded successfully:", uploadData);

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        console.log("Public URL generated:", publicUrl);

        // Download and parse the PDF
        const response = await fetch(publicUrl);
        const arrayBuffer = await response.arrayBuffer();

        if (selectedFile.type === 'application/pdf') {
          console.log("Processing PDF file...");
          try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            console.log('PDF loading task created');
            
            const pdf = await loadingTask.promise;
            console.log('PDF loaded successfully, pages:', pdf.numPages);
            
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              console.log(`Processing page ${i}/${pdf.numPages}`);
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
            console.log('PDF text extracted:', cleanText.substring(0, 100) + '...');
            
            // Automatically analyze the resume after extraction
            await analyzeResume(cleanText);
          } catch (pdfError) {
            console.error('PDF processing error:', pdfError);
            throw new Error('Failed to process PDF file: ' + pdfError.message);
          }
        } else {
          // For other file types use FileReader
          const text = await new Response(arrayBuffer).text();
          setResume(text);
          console.log('Text file content extracted:', text.substring(0, 100) + '...');
          
          // Automatically analyze the resume after extraction
          await analyzeResume(text);
        }
      } catch (error: any) {
        console.error("Error reading file:", error);
        toast({
          title: "Fehler beim Lesen der Datei",
          description: error.message || "Die Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
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

      const parsedData = await parseResume(file, textToAnalyze, OPENAI_API_KEY);
      if (parsedData) {
        console.log('Resume parsed successfully, raw data:', parsedData);
        const jsonData = JSON.parse(parsedData);
        console.log('Parsed JSON data:', jsonData);
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
          onClick={() => analyzeResume()}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
        </Button>
      )}
    </div>
  );
}