import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { CandidateInfo } from "@/components/candidates/CandidateInfo";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { CandidateAttachments } from "@/components/candidates/CandidateAttachments";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading, error } = useCandidate(Number(id));
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update(candidate)
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Änderungen gespeichert",
        description: "Die Kandidateninformationen wurden erfolgreich aktualisiert.",
      });

      // Refresh the candidate data
      queryClient.invalidateQueries({ queryKey: ["candidate", Number(id)] });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-lg text-muted-foreground">Lädt Kandidatendetails...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !candidate) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-lg text-destructive">
            {error ? "Ein Fehler ist aufgetreten" : "Kandidat nicht gefunden"}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <CandidateInfo candidate={candidate} />
            <CandidateTimeline candidate={candidate} />
            <div className="flex justify-start mt-6">
              <Button onClick={handleSave} className="w-full lg:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <CandidateApplications candidateId={candidate.id} />
            <CandidateAttachments candidate={candidate} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}