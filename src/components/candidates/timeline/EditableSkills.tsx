import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { SkillsInput } from "../SkillsInput";
import { SkillsSection } from "./SkillsSection";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";

interface EditableSkillsProps {
  candidate: Candidate;
}

export function EditableSkills({ candidate }: EditableSkillsProps) {
  const [editingSkills, setEditingSkills] = useState(false);
  const [skills, setSkills] = useState<string[]>(candidate.skills || []);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSaveSkills = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update({ skills })
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Fähigkeiten aktualisiert",
        description: "Die Fähigkeiten wurden erfolgreich gespeichert.",
      });
      
      setEditingSkills(false);
      queryClient.invalidateQueries({ queryKey: ["candidate", candidate.id] });
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Fehler",
        description: "Die Fähigkeiten konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      {!editingSkills && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => setEditingSkills(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      
      {editingSkills ? (
        <div className="space-y-4">
          <h3 className="font-medium">Fähigkeiten bearbeiten</h3>
          <SkillsInput skills={skills} setSkills={setSkills} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              setSkills(candidate.skills || []);
              setEditingSkills(false);
            }}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveSkills}>
              Speichern
            </Button>
          </div>
        </div>
      ) : (
        candidate.skills && candidate.skills.length > 0 && (
          <SkillsSection skills={candidate.skills} />
        )
      )}
    </div>
  );
}