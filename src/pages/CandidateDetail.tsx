import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { CandidateInfo } from "@/components/candidates/CandidateInfo";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { CandidateAttachments } from "@/components/candidates/CandidateAttachments";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading } = useCandidate(Number(id));

  if (isLoading) {
    return <div>Lädt Kandidatendetails...</div>;
  }

  if (!candidate) {
    return <div>Kandidat nicht gefunden</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <CandidateInfo candidate={candidate} />
          <CandidateApplications candidateId={candidate.id} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <CandidateTimeline candidate={candidate} />
          <CandidateAttachments candidate={candidate} />
        </div>
      </div>
    </DashboardLayout>
  );
}