import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidatesPipeline } from "@/components/candidates/CandidatesPipeline";

export default function Pipeline() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Übersicht über alle Kandidaten im Bewerbungsprozess
          </p>
        </div>
      </div>
      <CandidatesPipeline />
    </DashboardLayout>
  );
}