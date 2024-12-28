import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

      {workReferenceEvaluation && (
        <div>
          <label className="block text-sm font-medium mb-2">
            KI-Einschätzung des Arbeitszeugnisses
          </label>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">{workReferenceEvaluation}</p>
          </div>
        </div>
      )}
    </div>
  );
}