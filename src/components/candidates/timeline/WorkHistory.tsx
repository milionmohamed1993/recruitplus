import { useQuery } from "@tanstack/react-query";
import { Briefcase, Plus } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface WorkHistoryProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function WorkHistory({ candidate, onEntryClick }: WorkHistoryProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWorkHistory, setNewWorkHistory] = useState({
    position: "",
    company: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workHistory } = useQuery({
    queryKey: ["candidate-work-history", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddWorkHistory = async () => {
    try {
      const { error } = await supabase
        .from("candidate_work_history")
        .insert({
          ...newWorkHistory,
          candidate_id: candidate.id,
        });

      if (error) throw error;

      toast({
        title: "Arbeitserfahrung hinzugefügt",
        description: "Die Arbeitserfahrung wurde erfolgreich hinzugefügt.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["candidate-work-history", candidate.id] });
      setIsAddDialogOpen(false);
      setNewWorkHistory({
        position: "",
        company: "",
        start_date: "",
        end_date: "",
        is_current: false,
        description: "",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Arbeitserfahrung konnte nicht hinzugefügt werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Berufserfahrung</h3>
        <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Hinzufügen
        </Button>
      </div>

      {workHistory?.map((entry) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          onEntryClick={onEntryClick}
        />
      ))}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Arbeitserfahrung hinzufügen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input
                placeholder="Position"
                value={newWorkHistory.position}
                onChange={(e) => setNewWorkHistory({ ...newWorkHistory, position: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Unternehmen"
                value={newWorkHistory.company}
                onChange={(e) => setNewWorkHistory({ ...newWorkHistory, company: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                placeholder="Startdatum"
                value={newWorkHistory.start_date}
                onChange={(e) => setNewWorkHistory({ ...newWorkHistory, start_date: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Enddatum"
                value={newWorkHistory.end_date}
                onChange={(e) => setNewWorkHistory({ ...newWorkHistory, end_date: e.target.value })}
              />
            </div>
            <div>
              <Textarea
                placeholder="Beschreibung"
                value={newWorkHistory.description}
                onChange={(e) => setNewWorkHistory({ ...newWorkHistory, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleAddWorkHistory}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}