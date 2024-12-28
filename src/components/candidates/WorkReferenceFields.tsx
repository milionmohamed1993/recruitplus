import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { processResumeFile } from "@/utils/fileProcessor";
import { analyzeResumeWithGPT } from "@/utils/openai";

interface WorkReferenceFieldsProps {
  workReference: string;
  setWorkReference: (value: string) => void;
  workReferenceEvaluation: string;
  setWorkReferenceEvaluation: (value: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  onRemoveFile: (index: number) => void;
}

export function WorkReferenceFields({
  workReference,
  setWorkReference,
  workReferenceEvaluation,
  setWorkReferenceEvaluation,
  onFileSelect,
  files,
  onRemoveFile,
}: WorkReferenceFieldsProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeWorkReferences = async () => {
    if (files.length === 0 && !workReference) {
      toast({
        title: "Keine Dokumente",
        description: "Bitte laden Sie mindestens ein Arbeitszeugnis oder Zertifikat hoch oder fügen Sie den Text ein.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    setProgress(0);

    try {
      let combinedEvaluation = "";
      const totalSteps = files.length + (workReference ? 1 : 0);
      let currentStep = 0;

      // First analyze uploaded files
      for (const file of files) {
        try {
          setProgress((currentStep / totalSteps) * 100);
          const extractedText = await processResumeFile(file);
          
          const result = await analyzeResumeWithGPT(extractedText);
          currentStep++;

          try {
            const parsedResult = JSON.parse(result);
            combinedEvaluation += `\n${file.name}:\n`;
            combinedEvaluation += `Bewertung: ${parsedResult.rating}/6\n`;
            combinedEvaluation += `Analyse: ${parsedResult.evaluation}\n`;
            combinedEvaluation += `Schlüsselwörter: ${parsedResult.keywords.join(", ")}\n`;
            if (parsedResult.strengths) {
              combinedEvaluation += `Stärken: ${parsedResult.strengths.join(", ")}\n`;
            }
            if (parsedResult.developmentAreas) {
              combinedEvaluation += `Entwicklungspotenzial: ${parsedResult.developmentAreas.join(", ")}\n`;
            }
            if (parsedResult.hiddenMessages) {
              combinedEvaluation += `Versteckte Botschaften: ${parsedResult.hiddenMessages.join(", ")}\n`;
            }
            if (parsedResult.overallImpression) {
              combinedEvaluation += `Gesamteindruck: ${parsedResult.overallImpression}\n`;
            }
          } catch (parseError) {
            console.error('Error parsing result:', parseError);
            combinedEvaluation += `\n${file.name}: ${result}\n`;
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          toast({
            title: `Fehler bei ${file.name}`,
            description: "Die Datei konnte nicht analysiert werden.",
            variant: "destructive",
          });
        }
      }

      // Then analyze pasted text if present
      if (workReference) {
        setProgress((currentStep / totalSteps) * 100);
        try {
          const result = await analyzeResumeWithGPT(workReference);
          currentStep++;

          try {
            const parsedResult = JSON.parse(result);
            combinedEvaluation += `\nEingefügter Text:\n`;
            combinedEvaluation += `Bewertung: ${parsedResult.rating}/6\n`;
            combinedEvaluation += `Analyse: ${parsedResult.evaluation}\n`;
            combinedEvaluation += `Schlüsselwörter: ${parsedResult.keywords.join(", ")}\n`;
            if (parsedResult.strengths) {
              combinedEvaluation += `Stärken: ${parsedResult.strengths.join(", ")}\n`;
            }
            if (parsedResult.developmentAreas) {
              combinedEvaluation += `Entwicklungspotenzial: ${parsedResult.developmentAreas.join(", ")}\n`;
            }
            if (parsedResult.hiddenMessages) {
              combinedEvaluation += `Versteckte Botschaften: ${parsedResult.hiddenMessages.join(", ")}\n`;
            }
            if (parsedResult.overallImpression) {
              combinedEvaluation += `Gesamteindruck: ${parsedResult.overallImpression}\n`;
            }
          } catch (parseError) {
            console.error('Error parsing result:', parseError);
            combinedEvaluation += `\nEingefügter Text: ${result}\n`;
          }
        } catch (textError) {
          console.error('Error analyzing pasted text:', textError);
          toast({
            title: "Fehler",
            description: "Der eingegebene Text konnte nicht analysiert werden.",
            variant: "destructive",
          });
        }
      }

      setProgress(100);
      setWorkReferenceEvaluation(combinedEvaluation.trim());
      toast({
        title: "Analyse abgeschlossen",
        description: "Die Arbeitszeugnisse wurden erfolgreich analysiert.",
      });
    } catch (error) {
      console.error('Error in analyzeWorkReferences:', error);
      toast({
        title: "Fehler",
        description: "Bei der Analyse der Arbeitszeugnisse ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Arbeitszeugnisse & Zertifikate hochladen
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => document.getElementById('reference-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Dateien hochladen
            </Button>
            <input
              id="reference-upload"
              type="file"
              className="hidden"
              accept=".doc,.docx,.pdf"
              onChange={onFileSelect}
              multiple
            />
          </div>
          
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-sm text-muted-foreground">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Arbeitszeugnis Text (Optional)
        </label>
        <Textarea
          value={workReference}
          onChange={(e) => setWorkReference(e.target.value)}
          placeholder="Fügen Sie hier den Text des Arbeitszeugnisses ein..."
          className="h-32"
        />
      </div>

      <Button
        type="button"
        onClick={analyzeWorkReferences}
        className="w-full md:w-auto"
        variant="secondary"
        disabled={analyzing}
      >
        <FileSearch className="mr-2 h-4 w-4" />
        {analyzing ? "Analyse läuft..." : "Arbeitszeugnisse analysieren"}
      </Button>

      {analyzing && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Analyse läuft... {Math.round(progress)}%
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {workReferenceEvaluation && (
        <div>
          <label className="block text-sm font-medium mb-2">
            KI-Einschätzung der Arbeitszeugnisse
          </label>
          <div className="bg-muted p-4 rounded-md whitespace-pre-line">
            <p className="text-sm text-muted-foreground">{workReferenceEvaluation}</p>
          </div>
        </div>
      )}
    </div>
  );
}