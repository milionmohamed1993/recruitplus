import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { parseResume } from "@/utils/resumeParser";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

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
        const text = await selectedFile.text();
        setResume(text);
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
          accept=".doc,.docx"
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