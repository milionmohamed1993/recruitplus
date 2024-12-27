import { Card } from "@/components/ui/card";
import { useCandidates } from "@/hooks/useCandidates";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export function CandidatesList() {
  const { data: candidates, isLoading } = useCandidates();

  if (isLoading) {
    return <div>Lädt Kandidaten...</div>;
  }

  return (
    <div className="space-y-4">
      {candidates?.map((candidate) => (
        <Card key={candidate.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{candidate.name}</div>
              <div className="text-sm text-muted-foreground">
                {candidate.position}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {candidate.email}
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/candidates/${candidate.id}/pipeline`}>
                <Eye className="h-4 w-4 mr-2" />
                Pipeline anzeigen
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}