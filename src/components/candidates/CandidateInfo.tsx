import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Candidate } from "@/types/database.types";

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
        <CardTitle>{candidate.name}</CardTitle>
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
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <Badge variant="secondary">{candidate.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}