import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";

export function AddCandidateForm() {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        const text = await selectedFile.text();
        setResume(text);
        toast({
          title: "Lebenslauf hochgeladen",
          description: "Der Lebenslauf wurde erfolgreich hochgeladen.",
        });
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Beim Hochladen des Lebenslaufs ist ein Fehler aufgetreten.",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Extract work experience, education, and skills from this resume.",
            },
            {
              role: "user",
              content: resume,
            },
          ],
        }),
      });

      const data = await response.json();
      toast({
        title: "Lebenslauf analysiert",
        description: "Die Informationen wurden erfolgreich extrahiert.",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Fehler",
        description: "Beim Analysieren des Lebenslaufs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Lebenslauf
          </label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
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
                accept=".txt,.pdf,.doc,.docx"
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
          </div>
        </div>
        <Button onClick={analyzeResume} disabled={isAnalyzing}>
          {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
        </Button>
      </div>
    </div>
  );
}