import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { CandidateInfo } from "@/components/candidates/CandidateInfo";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { CandidateAttachments } from "@/components/candidates/CandidateAttachments";
import { CandidateNotes } from "@/components/candidates/CandidateNotes";
import { CandidateChecklist } from "@/components/candidates/checklist/CandidateChecklist";
import { SkillAnalysis } from "@/components/candidates/skill-analysis/SkillAnalysis";
import { Button } from "@/components/ui/button";
import { Save, User, Briefcase, FileText, GraduationCap, MessageSquare, CheckSquare, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Bewerbungen
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Werdegang
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dokumente
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notizen
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Checkliste
              </TabsTrigger>
              <TabsTrigger value="skill-analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Skill-Analyse
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <CandidateInfo candidate={candidate} />
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <CandidateApplications candidateId={candidate.id} />
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <CandidateTimeline candidate={candidate} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <CandidateAttachments candidate={candidate} />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <CandidateNotes candidate={candidate} />
            </TabsContent>

            <TabsContent value="checklist" className="mt-6">
              <CandidateChecklist candidate={candidate} />
            </TabsContent>

            <TabsContent value="skill-analysis" className="mt-6">
              <SkillAnalysis candidate={candidate} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}