import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Candidate } from "@/types/database.types";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CandidateInfoProps {
  candidate: Candidate;
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState(candidate);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .delete()
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Kandidat gelöscht",
        description: "Der Kandidat wurde erfolgreich gelöscht.",
      });
      navigate("/candidates");
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Der Kandidat konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{candidate.name}</CardTitle>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Kandidat löschen</AlertDialogTitle>
                    <AlertDialogDescription>
                      Sind Sie sicher, dass Sie diesen Kandidaten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Löschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
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
        </div>
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