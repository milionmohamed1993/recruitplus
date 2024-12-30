import { Card, CardContent } from "@/components/ui/card";
import type { Candidate } from "@/types/database.types";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Calendar, Globe, Flag } from "lucide-react";

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
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Kontakt Informationen */}
        <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
          <h3 className="font-medium text-sm text-muted-foreground mb-4">Kontakt</h3>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-medium">E-Mail</div>
              <div className="text-sm text-muted-foreground">{candidate.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-medium">Telefon</div>
              <div className="text-sm text-muted-foreground">{candidate.phone || 'Nicht angegeben'}</div>
            </div>
          </div>
        </div>

        {/* Persönliche Informationen */}
        <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
          <h3 className="font-medium text-sm text-muted-foreground mb-4">Persönlich</h3>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-medium">Geburtsdatum</div>
              <div className="text-sm text-muted-foreground">
                {candidate.birthdate 
                  ? format(new Date(candidate.birthdate), 'dd.MM.yyyy')
                  : 'Nicht angegeben'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Flag className="w-4 h-4 text-primary" />
            <div>
              <div className="text-sm font-medium">Nationalität</div>
              <div className="text-sm text-muted-foreground">{candidate.nationality || 'Nicht angegeben'}</div>
            </div>
          </div>
        </div>

        {/* Standort Informationen */}
        <div className="space-y-4 bg-accent/20 p-4 rounded-lg md:col-span-2">
          <h3 className="font-medium text-sm text-muted-foreground mb-4">Standort</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Adresse</div>
                <div className="text-sm text-muted-foreground">{candidate.address || 'Nicht angegeben'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Standort</div>
                <div className="text-sm text-muted-foreground">{candidate.location || 'Nicht angegeben'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}