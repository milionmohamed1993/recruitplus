import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { GenderSelect } from "./GenderSelect";
import type { Candidate } from "@/types/database.types";
import { PersonalInfoDisplay } from "./info/PersonalInfoDisplay";
import { ProfessionalInfoDisplay } from "./info/ProfessionalInfoDisplay";
import { EducationInfoDisplay } from "./info/EducationInfoDisplay";

interface CandidateInfoProps {
  candidate: Candidate;
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState(candidate);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update(editedCandidate)
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Änderungen gespeichert",
        description: "Die Kandidateninformationen wurden erfolgreich aktualisiert.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        {isEditing ? (
          <Input
            value={editedCandidate.name}
            onChange={(e) =>
              setEditedCandidate({ ...editedCandidate, name: e.target.value })
            }
            className="max-w-[200px]"
          />
        ) : (
          <CardTitle>{candidate.name}</CardTitle>
        )}
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditedCandidate(candidate);
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <div className="space-y-6">
        <div>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                {isEditing ? (
                  <Input
                    value={editedCandidate.email}
                    onChange={(e) =>
                      setEditedCandidate({ ...editedCandidate, email: e.target.value })
                    }
                  />
                ) : (
                  <div>{candidate.email}</div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Position</div>
                {isEditing ? (
                  <Input
                    value={editedCandidate.position || ""}
                    onChange={(e) =>
                      setEditedCandidate({ ...editedCandidate, position: e.target.value })
                    }
                  />
                ) : (
                  <div>{candidate.position}</div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Geschlecht</div>
                {isEditing ? (
                  <GenderSelect
                    value={editedCandidate.gender || 'other'}
                    onChange={(value) =>
                      setEditedCandidate({ ...editedCandidate, gender: value })
                    }
                  />
                ) : (
                  <div>
                    {candidate.gender === 'male' ? 'Herr' :
                     candidate.gender === 'female' ? 'Frau' : 'Andere'}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge variant="secondary">{candidate.status}</Badge>
              </div>
            </div>
          </CardContent>
        </div>

        <div>
          <CardHeader>
            <CardTitle className="text-lg">Persönliche Informationen</CardTitle>
          </CardHeader>
          <PersonalInfoDisplay
            candidate={candidate}
            isEditing={isEditing}
            editedCandidate={editedCandidate}
            setEditedCandidate={setEditedCandidate}
          />
        </div>

        <div>
          <CardHeader>
            <CardTitle className="text-lg">Berufliche Informationen</CardTitle>
          </CardHeader>
          <ProfessionalInfoDisplay
            candidate={candidate}
            isEditing={isEditing}
            editedCandidate={editedCandidate}
            setEditedCandidate={setEditedCandidate}
          />
        </div>

        <div>
          <CardHeader>
            <CardTitle className="text-lg">Ausbildung</CardTitle>
          </CardHeader>
          <EducationInfoDisplay
            candidate={candidate}
            isEditing={isEditing}
            editedCandidate={editedCandidate}
            setEditedCandidate={setEditedCandidate}
          />
        </div>
      </div>
    </Card>
  );
}