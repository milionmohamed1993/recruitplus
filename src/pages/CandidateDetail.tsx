import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidateInfo } from "@/components/candidates/CandidateInfo";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { useParams } from "react-router-dom";
import { useCandidate } from "@/hooks/useCandidate";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading } = useCandidate(Number(id));

  if (isLoading) {
    return <div>Lädt Kandidatendetails...</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CandidateInfo candidate={candidate} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CandidateTimeline candidate={candidate} />
          <CandidateApplications candidateId={Number(id)} />
        </div>
      </div>
    </DashboardLayout>
  );
}