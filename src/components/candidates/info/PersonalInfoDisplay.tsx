import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Candidate } from "@/types/database.types";
import { format } from "date-fns";
import { Contact, User, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Contact className="h-4 w-4" />
            Kontakt
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Persönlich
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Standort
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Beruflich
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Telefon</div>
              {isEditing ? (
                <Input
                  value={editedCandidate.phone || ''}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, phone: e.target.value })}
                />
              ) : (
                <div>{candidate.phone || 'Nicht angegeben'}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">E-Mail</div>
              <div>{candidate.email || 'Nicht angegeben'}</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Geburtsdatum</div>
              <div>
                {candidate.birthdate 
                  ? format(new Date(candidate.birthdate), 'dd.MM.yyyy')
                  : 'Nicht angegeben'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Nationalität</div>
              {isEditing ? (
                <Input
                  value={editedCandidate.nationality || ''}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, nationality: e.target.value })}
                />
              ) : (
                <div>{candidate.nationality || 'Nicht angegeben'}</div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Adresse</div>
              {isEditing ? (
                <Input
                  value={editedCandidate.address || ''}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, address: e.target.value })}
                />
              ) : (
                <div>{candidate.address || 'Nicht angegeben'}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Standort</div>
              {isEditing ? (
                <Input
                  value={editedCandidate.location || ''}
                  onChange={(e) => setEditedCandidate({ ...editedCandidate, location: e.target.value })}
                />
              ) : (
                <div>{candidate.location || 'Nicht angegeben'}</div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="mt-4">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Position</div>
              <div>{candidate.position || 'Nicht angegeben'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Firma</div>
              <div>{candidate.company || 'Nicht angegeben'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Abteilung</div>
              <div>{candidate.department || 'Nicht angegeben'}</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  );
}