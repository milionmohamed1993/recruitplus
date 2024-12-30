import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface DocumentUploadProps {
  candidateId: number;
  category: 'reference' | 'resume' | 'certificate';
  onUpload: (file: any) => void;
}

export function DocumentUpload({ candidateId, category, onUpload }: DocumentUploadProps) {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Instead of inserting directly to the database,
      // we pass the file data to the parent component
      onUpload({
        candidate_id: candidateId,
        file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        category: category
      });
      
      toast({
        title: "Dokument hochgeladen",
        description: "Klicken Sie auf 'Speichern' um die Änderungen zu übernehmen.",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht hochgeladen werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => document.getElementById(`file-upload-${category}`)?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Dokument hochladen
      </Button>
      <input
        id={`file-upload-${category}`}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx"
      />
    </div>
  );
}