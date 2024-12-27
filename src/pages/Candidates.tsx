import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidatesList } from "@/components/candidates/CandidatesList";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Candidates() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold tracking-tight">Kandidaten</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Hier finden Sie eine Übersicht aller Kandidaten. Sie können neue Kandidaten hinzufügen, 
              bestehende Profile einsehen und den Bewerbungsprozess verwalten.
            </p>
          </div>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/candidates/add" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Kandidat hinzufügen
            </Link>
          </Button>
        </div>
        <CandidatesList />
      </div>
    </DashboardLayout>
  );
}