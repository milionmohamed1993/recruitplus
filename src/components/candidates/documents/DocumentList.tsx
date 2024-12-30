import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

interface DocumentListProps {
  documents: Array<{
    id: number;
    file_name: string;
    file_path: string;
    created_at?: string;
  }>;
  onPreview: (document: any) => void;
}

export function DocumentList({ documents, onPreview }: DocumentListProps) {
  const queryClient = useQueryClient();

  const handleDelete = async (document: any) => {
    try {
      // First, delete from storage
      const { error: storageError } = await supabase.storage
        .from("attachments")
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Then, delete from database
      const { error: dbError } = await supabase
        .from("candidate_attachments")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;

      // Force an immediate refetch of the documents
      await queryClient.invalidateQueries({ 
        queryKey: ["candidate-attachments"],
        exact: true
      });

      toast({
        title: "Dokument gelöscht",
        description: "Das Dokument wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Fehler",
        description: "Das Dokument konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("attachments")
      .download(filePath);

    if (error) {
      console.error("Error downloading file:", error);
      return;
    }

    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!documents.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Keine Dokumente in dieser Kategorie
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            <div>
              <div className="font-medium">{document.file_name}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(document.created_at || '').toLocaleDateString("de-DE")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(document)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(document.file_path, document.file_name)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(document)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}