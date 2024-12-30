import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentList } from "./documents/DocumentList";
import { DocumentUpload } from "./documents/DocumentUpload";

interface CandidateAttachmentsProps {
  candidate: Candidate;
}

type DocumentCategory = 'reference' | 'resume' | 'certificate';

interface CandidateAttachment {
  id: number;
  candidate_id: number;
  file_name: string;
  file_path: string;
  file_type?: string;
  analysis?: string;
  created_at?: string;
  category?: DocumentCategory;
}

export function CandidateAttachments({ candidate }: CandidateAttachmentsProps) {
  const [selectedFile, setSelectedFile] = useState<CandidateAttachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handlePreview = async (attachment: CandidateAttachment) => {
    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(attachment.file_path, 3600);

    if (error) {
      console.error("Error creating preview URL:", error);
      return;
    }

    setSelectedFile(attachment);
    setPreviewUrl(data.signedUrl);
  };

  const renderDocumentSection = (category: DocumentCategory) => {
    const categoryAttachments = attachments?.filter(
      (attachment: CandidateAttachment) => attachment.category === category
    ) || [];

    return (
      <>
        <DocumentUpload candidateId={candidate.id} category={category} />
        <DocumentList 
          documents={categoryAttachments}
          onPreview={handlePreview}
        />
      </>
    );
  };

  if (!attachments?.length && !candidate.id) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lebenslauf
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Zeugnisse
            </TabsTrigger>
            <TabsTrigger value="certificate" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Zertifikate
            </TabsTrigger>
          </TabsList>
          <TabsContent value="resume">
            {renderDocumentSection('resume')}
          </TabsContent>
          <TabsContent value="reference">
            {renderDocumentSection('reference')}
          </TabsContent>
          <TabsContent value="certificate">
            {renderDocumentSection('certificate')}
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog 
        open={!!selectedFile} 
        onOpenChange={() => {
          setSelectedFile(null);
          setPreviewUrl(null);
        }}
      >
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedFile?.file_name}</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-full rounded-lg"
              title="Document Preview"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}