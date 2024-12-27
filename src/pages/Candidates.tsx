import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidatesList } from "@/components/candidates/CandidatesList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Candidates() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kandidaten</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Kandidaten und deren Bewerbungsprozess
          </p>
        </div>
        <Button asChild>
          <Link to="/candidates/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Kandidat hinzufügen
          </Link>
        </Button>
      </div>
      <CandidatesList />
    </DashboardLayout>
  );
}