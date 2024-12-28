import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { CandidateInfo } from "@/components/candidates/CandidateInfo";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { CandidateAttachments } from "@/components/candidates/CandidateAttachments";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading, error } = useCandidate(Number(id));

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
      <div className="container mx-auto py-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <CandidateInfo candidate={candidate} />
            <CandidateTimeline candidate={candidate} />
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