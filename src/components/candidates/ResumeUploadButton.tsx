import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ResumeUploadButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files: File[];
  onRemoveFile: (index: number) => void;
}

export function ResumeUploadButton({ onFileSelect, files, onRemoveFile }: ResumeUploadButtonProps) {
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
      
      {files.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full md:w-auto"
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Weitere Dateien hinzufügen
        </Button>
      )}
    </div>
  );
}