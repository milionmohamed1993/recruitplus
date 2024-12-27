import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/types/database.types";

interface CandidateInfoProps {
  candidate: Candidate;
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{candidate.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div>{candidate.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Position</div>
            <div>{candidate.position}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <Badge variant="secondary">{candidate.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}