import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCandidateForm } from "@/components/candidates/AddCandidateForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function AddCandidate() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kandidat erstellen</h1>
          <p className="text-muted-foreground">
            Fügen Sie einen neuen Kandidaten hinzu und analysieren Sie seinen Lebenslauf
          </p>
        </div>
        <Button type="submit" form="candidate-form" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Kandidat erstellen
        </Button>
      </div>
      <AddCandidateForm />
    </DashboardLayout>
  );
}