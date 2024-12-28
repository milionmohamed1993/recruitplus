import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";

interface CandidateAttachmentsProps {
  candidate: Candidate;
}

export function CandidateAttachments({ candidate }: CandidateAttachmentsProps) {
  const { data: attachments } = useQuery({
    queryKey: ["candidate-attachments", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_attachments")
        .select("*")
        .eq("candidate_id", candidate.id);

      if (error) throw error;
      return data;
    },
  });

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

  if (!attachments?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md cursor-pointer"
              onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">{attachment.file_name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}