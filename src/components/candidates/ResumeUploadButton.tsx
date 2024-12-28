import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ResumeUploadButtonProps {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

export function ResumeUploadButton({ onFileSelect, file }: ResumeUploadButtonProps) {
  return (
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
      />
      {file && (
        <span className="text-sm text-muted-foreground">
          {file.name}
        </span>
      )}
    </div>
  );
}