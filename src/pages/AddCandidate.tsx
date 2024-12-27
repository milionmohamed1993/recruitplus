import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCandidateForm } from "@/components/candidates/AddCandidateForm";

export default function AddCandidate() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kandidat hinzufügen</h1>
          <p className="text-muted-foreground">
            Fügen Sie einen neuen Kandidaten hinzu und analysieren Sie seinen Lebenslauf
          </p>
        </div>
      </div>
      <AddCandidateForm />
    </DashboardLayout>
  );
}