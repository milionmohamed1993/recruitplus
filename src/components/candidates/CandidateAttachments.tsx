import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Eye, Award, User, Badge } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      // Categorize documents based on their names and content
      return data.map((attachment: CandidateAttachment) => ({
        ...attachment,
        category: categorizeDocument(attachment.file_name, attachment.analysis),
      }));
    },
  });

  const categorizeDocument = (fileName: string, analysis?: string): DocumentCategory => {
    const lowerFileName = fileName.toLowerCase();
    const lowerAnalysis = analysis?.toLowerCase() || '';

    // Check for references
    if (
      lowerFileName.includes('zeugnis') ||
      lowerFileName.includes('referenz') ||
      lowerAnalysis.includes('arbeitszeugnis') ||
      lowerAnalysis.includes('zwischenzeugnis')
    ) {
      return 'reference';
    }

    // Check for resumes
    if (
      lowerFileName.includes('lebenslauf') ||
      lowerFileName.includes('cv') ||
      lowerFileName.includes('resume') ||
      lowerAnalysis.includes('lebenslauf') ||
      lowerAnalysis.includes('berufserfahrung')
    ) {
      return 'resume';
    }

    // Check for certificates
    if (
      lowerFileName.includes('zertifikat') ||
      lowerFileName.includes('certificate') ||
      lowerFileName.includes('bescheinigung') ||
      lowerAnalysis.includes('zertifizierung')
    ) {
      return 'certificate';
    }

    // Default to resume if no clear category is found
    return 'resume';
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

  const handlePreview = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error("Error creating preview URL:", error);
      return;
    }

    setPreviewUrl(data.signedUrl);
  };

  const renderDocumentList = (category: DocumentCategory) => {
    const categoryAttachments = attachments?.filter(
      (attachment: CandidateAttachment) => attachment.category === category
    );

    if (!categoryAttachments?.length) {
      return (
        <div className="text-center text-muted-foreground py-8">
          Keine Dokumente in dieser Kategorie
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {categoryAttachments.map((attachment: CandidateAttachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5" />
              <div>
                <div className="font-medium">{attachment.file_name}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(attachment.created_at || '').toLocaleDateString("de-DE")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(attachment);
                  handlePreview(attachment.file_path);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!attachments?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dokumente</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="references" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="references" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Zwischenzeugnisse
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Lebenslauf
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Badge className="h-4 w-4" />
              Zertifikate
            </TabsTrigger>
          </TabsList>
          <TabsContent value="references">
            {renderDocumentList('reference')}
          </TabsContent>
          <TabsContent value="resume">
            {renderDocumentList('resume')}
          </TabsContent>
          <TabsContent value="certificates">
            {renderDocumentList('certificate')}
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