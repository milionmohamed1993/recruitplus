import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCandidateForm } from "@/components/candidates/AddCandidateForm";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

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
          <Button 
            type="submit" 
            form="add-candidate-form"
            size="lg"
            variant="default"
            className="flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all text-primary-foreground"
          >
            <UserPlus className="h-5 w-5" />
            Kandidat erstellen
          </Button>
        </div>
        <AddCandidateForm />
      </div>
    </DashboardLayout>
  );
}