import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCandidateForm } from "@/components/candidates/AddCandidateForm";
import { FormSubmitButton } from "@/components/candidates/forms/FormSubmitButton";

export default function AddCandidate() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kandidat erstellen</h1>
            <p className="text-muted-foreground">
              Fügen Sie einen neuen Kandidaten hinzu und analysieren Sie seinen Lebenslauf
            </p>
          </div>
          <FormSubmitButton />
        </div>
        <AddCandidateForm />
      </div>
    </DashboardLayout>
  );
}