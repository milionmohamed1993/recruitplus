import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Werdegang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Zeitstrahl-Einträge werden aus den analysierten Lebenslaufdaten gefüllt */}
          <div className="relative pl-4 border-l-2 border-border">
            <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-2" />
            <div className="font-medium">{candidate.position}</div>
            <div className="text-sm text-muted-foreground">{candidate.company}</div>
            <div className="text-sm text-muted-foreground">Aktuelle Position</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}