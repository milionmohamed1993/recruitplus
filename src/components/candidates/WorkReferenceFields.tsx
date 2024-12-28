import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

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
  const analyzeWorkReferences = async () => {
    if (files.length === 0 && !workReference) {
      toast({
        title: "Keine Dokumente",
        description: "Bitte laden Sie mindestens ein Arbeitszeugnis oder Zertifikat hoch oder fügen Sie den Text ein.",
        variant: "destructive",
      });
      return;
    }

    try {
      let combinedEvaluation = "";

      // First analyze uploaded files
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'reference');

        const { data, error } = await supabase.functions.invoke('analyze-document', {
          body: formData,
        });

        if (error) throw error;
        combinedEvaluation += `\n${file.name}: ${data.evaluation}\n`;
      }

      // Then analyze pasted text if present
      if (workReference) {
        const formData = new FormData();
        const textFile = new File([workReference], "reference.txt", { type: "text/plain" });
        formData.append('file', textFile);
        formData.append('type', 'reference');

        const { data, error } = await supabase.functions.invoke('analyze-document', {
          body: formData,
        });

        if (error) throw error;
        combinedEvaluation += `\nEingefügter Text: ${data.evaluation}\n`;
      }

      setWorkReferenceEvaluation(combinedEvaluation.trim());
      toast({
        title: "Analyse abgeschlossen",
        description: "Die Arbeitszeugnisse wurden erfolgreich analysiert.",
      });
    } catch (error) {
      console.error('Error analyzing work references:', error);
      toast({
        title: "Fehler",
        description: "Bei der Analyse der Arbeitszeugnisse ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
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
      >
        <FileSearch className="mr-2 h-4 w-4" />
        Arbeitszeugnisse analysieren
      </Button>

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