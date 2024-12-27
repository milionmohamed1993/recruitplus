import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { parseResume } from "@/utils/resumeParser";

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
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };

  const analyzeResume = async () => {
    if (!file || !resume) return;
    
    setIsAnalyzing(true);
    try {
      const parsedData = await parseResume(file, resume);
      if (parsedData) {
        onResumeAnalyzed(JSON.parse(parsedData));
      }
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