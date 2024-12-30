import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Calendar, Globe, Flag, Building } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">E-Mail</div>
            <div className="text-sm">{candidate.email}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Telefon</div>
            <div className="text-sm">{candidate.phone || 'Nicht angegeben'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Adresse</div>
            <div className="text-sm">{candidate.address || 'Nicht angegeben'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Geburtsdatum</div>
            <div className="text-sm">
              {candidate.birthdate 
                ? format(new Date(candidate.birthdate), 'dd.MM.yyyy')
                : 'Nicht angegeben'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Standort</div>
            <div className="text-sm">{candidate.location || 'Nicht angegeben'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Flag className="w-4 h-4 mt-1 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium text-muted-foreground">Nationalität</div>
            <div className="text-sm">{candidate.nationality || 'Nicht angegeben'}</div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}