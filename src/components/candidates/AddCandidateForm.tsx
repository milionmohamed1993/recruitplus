import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AddCandidateForm() {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Process the extracted information
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
          <Textarea
            placeholder="Fügen Sie hier den Lebenslauf ein..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            className="h-64"
          />
        </div>
        <Button onClick={analyzeResume} disabled={isAnalyzing}>
          {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
        </Button>
      </div>
    </div>
  );
}