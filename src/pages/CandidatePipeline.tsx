import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidatesPipeline } from "@/components/candidates/CandidatesPipeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidatePipeline() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/candidates">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Liste
              </Link>
            </Button>
          </div>
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