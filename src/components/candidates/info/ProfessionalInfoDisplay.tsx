import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";

interface ProfessionalInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function ProfessionalInfoDisplay({ 
  candidate, 
  isEditing, 
  editedCandidate, 
  setEditedCandidate 
}: ProfessionalInfoDisplayProps) {
  return (
    <CardContent>
      <div className="grid gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Abteilung</div>
          <div>{candidate.department || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Branche</div>
          <div>{candidate.industry || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Berufserfahrung</div>
          <div>{candidate.experience || 'Nicht angegeben'}</div>
        </div>
      </div>
    </CardContent>
  );
}