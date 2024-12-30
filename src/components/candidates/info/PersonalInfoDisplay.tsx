import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";
import { format } from "date-fns";

interface PersonalInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function PersonalInfoDisplay({ 
  candidate, 
  isEditing, 
  editedCandidate, 
  setEditedCandidate 
}: PersonalInfoDisplayProps) {
  return (
    <CardContent>
      <div className="grid gap-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground">Adresse</div>
          <div>{candidate.address || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Telefon</div>
          <div>{candidate.phone || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Nationalität</div>
          <div>{candidate.nationality || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Geburtsdatum</div>
          <div>
            {candidate.birthdate 
              ? format(new Date(candidate.birthdate), 'dd.MM.yyyy')
              : 'Nicht angegeben'}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Standort</div>
          <div>{candidate.location || 'Nicht angegeben'}</div>
        </div>
      </div>
    </CardContent>
  );
}