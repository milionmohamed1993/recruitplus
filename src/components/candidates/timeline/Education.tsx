import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Plus } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface EducationProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function Education({ candidate, onEntryClick }: EducationProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: educationHistory, isError } = useQuery({
    queryKey: ["education-history", candidate.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("candidate_education")
          .select("*")
          .eq("candidate_id", candidate.id)
          .order("end_date", { ascending: false });

        if (error) {
          console.error("Error fetching education history:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in education history query:", error);
        return [];
      }
    },
    retry: false
  });

  const handleAddEducation = async () => {
    try {
      const { error } = await supabase
        .from("candidate_education")
        .insert({
          ...newEducation,
          candidate_id: candidate.id,
        });

      if (error) throw error;

      toast({
        title: "Ausbildung hinzugefügt",
        description: "Die Ausbildung wurde erfolgreich hinzugefügt.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["education-history", candidate.id] });
      setIsAddDialogOpen(false);
      setNewEducation({
        institution: "",
        degree: "",
        field_of_study: "",
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Ausbildung konnte nicht hinzugefügt werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Ausbildung</h3>
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Hinzufügen
        </Button>
      </div>

      {educationHistory?.map((entry) => (
        <TimelineEntry
          key={entry.id}
          entry={{
            id: entry.id,
            position: entry.degree,
            company: entry.institution,
            start_date: entry.start_date,
            end_date: entry.end_date,
            description: entry.field_of_study,
          }}
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
          onEntryClick={onEntryClick}
        />
      ))}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Ausbildung hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                placeholder="Institution"
                value={newEducation.institution}
                onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Abschluss"
                value={newEducation.degree}
                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Fachrichtung"
                value={newEducation.field_of_study}
                onChange={(e) => setNewEducation({ ...newEducation, field_of_study: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Startdatum"
                value={newEducation.start_date}
                onChange={(e) => setNewEducation({ ...newEducation, start_date: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Enddatum"
                value={newEducation.end_date}
                onChange={(e) => setNewEducation({ ...newEducation, end_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddEducation}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}