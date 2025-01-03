import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ResumeProgressDialog } from "./ResumeProgressDialog";
import { ResumeUploadButton } from "./ResumeUploadButton";
import { processResumeFile } from "@/utils/fileProcessor";
import { analyzeResumeWithGPT } from "@/utils/openai";

interface ResumeUploadProps {
  onResumeAnalyzed: (data: any) => void;
}

export function ResumeUpload({ onResumeAnalyzed }: ResumeUploadProps) {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      try {
        setIsAnalyzing(true);
        setProgress(10);
        setProgressStatus("Datei wird hochgeladen...");

        // Process the first file for resume analysis
        const extractedText = await processResumeFile(selectedFiles[0]);
        setResume(extractedText);
        
        setProgress(70);
        setProgressStatus("Lebenslauf wird analysiert...");
        await analyzeResume(extractedText);
      } catch (error: any) {
        console.error("Error processing file:", error);
        toast({
          title: "Fehler beim Verarbeiten der Datei",
          description: error.message || "Die Datei konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
        setProgress(0);
        setProgressStatus("");
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const analyzeResume = async (text?: string) => {
    const textToAnalyze = text || resume;
    
    if (!textToAnalyze) {
      toast({
        title: "Fehler",
        description: "Bitte laden Sie einen Lebenslauf hoch oder fügen Sie den Text ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProgress(85);
      setProgressStatus("KI-Analyse wird durchgeführt...");

      const result = await analyzeResumeWithGPT(textToAnalyze);
      
      try {
        const parsedData = JSON.parse(result);
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
      console.error("Error analyzing resume:", error);
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
        files={files}
        onRemoveFile={removeFile}
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