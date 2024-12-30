import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";

interface EducationInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function EducationInfoDisplay({ 
  candidate, 
  isEditing, 
  editedCandidate, 
  setEditedCandidate 
}: EducationInfoDisplayProps) {
  return (
    <CardContent>
      <div className="grid gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Ausbildung</div>
          <div>{candidate.education || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Universität</div>
          <div>{candidate.university || 'Nicht angegeben'}</div>
        </div>
      </div>
    </CardContent>
  );
}