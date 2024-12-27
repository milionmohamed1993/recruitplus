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
          {/* Timeline items will be populated from parsed resume data */}
          <div className="relative pl-4 border-l-2 border-border">
            <div className="absolute w-2 h-2 bg-primary rounded-full -left-[5px] top-2" />
            <div className="font-medium">Position Title</div>
            <div className="text-sm text-muted-foreground">Company Name</div>
            <div className="text-sm text-muted-foreground">2020 - Present</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}