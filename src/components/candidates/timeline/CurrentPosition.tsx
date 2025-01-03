import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Edit2, Save, X } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import type { Candidate } from "@/types/database.types";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface CurrentPositionProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function CurrentPosition({ candidate, onEntryClick }: CurrentPositionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPosition, setEditedPosition] = useState(candidate.position || "");
  const [editedCompany, setEditedCompany] = useState(candidate.company || "");
  const [editedStartDate, setEditedStartDate] = useState("");
  const queryClient = useQueryClient();

  const { data: currentPosition } = useQuery({
    queryKey: ["current-position", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .eq("is_current", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching current position:", error);
        return null;
      }
      
      if (data) {
        setEditedStartDate(data.start_date || "");
      }
      
      return data;
    },
  });

  const handleSave = async () => {
    try {
      // Update candidate info
      const { error: candidateError } = await supabase
        .from("candidates")
        .update({
          position: editedPosition,
          company: editedCompany,
        })
        .eq("id", candidate.id);

      if (candidateError) throw candidateError;

      // Update or create work history entry
      if (currentPosition) {
        const { error: workHistoryError } = await supabase
          .from("candidate_work_history")
          .update({
            position: editedPosition,
            company: editedCompany,
            start_date: editedStartDate,
          })
          .eq("id", currentPosition.id);

        if (workHistoryError) throw workHistoryError;
      } else {
        const { error: createError } = await supabase
          .from("candidate_work_history")
          .insert({
            candidate_id: candidate.id,
            position: editedPosition,
            company: editedCompany,
            start_date: editedStartDate,
            is_current: true,
          });

        if (createError) throw createError;
      }

      queryClient.invalidateQueries({ queryKey: ["candidate", candidate.id] });
      queryClient.invalidateQueries({ queryKey: ["current-position", candidate.id] });
      
      toast({
        title: "Position aktualisiert",
        description: "Die aktuelle Position wurde erfolgreich aktualisiert.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating position:", error);
      toast({
        title: "Fehler",
        description: "Die Position konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  if (!candidate.position && !isEditing) return null;

  return (
    <div className="relative">
      {!isEditing ? (
        <div className="absolute right-0 top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4 bg-accent/50 p-4 rounded-lg">
          <div>
            <label className="text-sm font-medium">Position</label>
            <Input
              value={editedPosition}
              onChange={(e) => setEditedPosition(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Firma</label>
            <Input
              value={editedCompany}
              onChange={(e) => setEditedCompany(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Startdatum</label>
            <Input
              type="date"
              value={editedStartDate}
              onChange={(e) => setEditedStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditedPosition(candidate.position || "");
                setEditedCompany(candidate.company || "");
                if (currentPosition) {
                  setEditedStartDate(currentPosition.start_date || "");
                }
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {!isEditing && (
        <TimelineEntry
          entry={{
            id: currentPosition?.id || 0,
            position: candidate.position || "",
            company: candidate.company || "",
            start_date: currentPosition?.start_date || new Date().toISOString(),
            is_current: true,
            description: "Aktuelle Position",
          }}
          icon={<Briefcase className="h-4 w-4 text-primary" />}
          isCurrent={true}
          onEntryClick={onEntryClick}
        />
      )}
    </div>
  );
}