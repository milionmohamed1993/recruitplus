import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";
import { NoteForm } from "./notes/NoteForm";
import { NotesList } from "./notes/NotesList";

interface CandidateNotesProps {
  candidate: Candidate;
}

export function CandidateNotes({ candidate }: CandidateNotesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading, error } = useQuery({
    queryKey: ["candidate-notes", candidate.id],
    queryFn: async () => {
      console.log("Fetching notes for candidate:", candidate.id);
      try {
        const { data, error } = await supabase
          .from("candidate_notes")
          .select("*")
          .eq("candidate_id", candidate.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Notes fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Error fetching notes:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const handleAddNote = async (category: string, answers: Record<string, string>) => {
    try {
      const formattedContent = Object.entries(answers)
        .map(([question, answer]) => `${question}\n${answer}`)
        .join("\n\n");

      const { error } = await supabase.from("candidate_notes").insert({
        candidate_id: candidate.id,
        content: formattedContent,
        category: category,
        created_by: "System User",
      });

      if (error) throw error;

      toast({
        title: "Notiz hinzugefügt",
        description: "Die Notiz wurde erfolgreich erstellt.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["candidate-notes", candidate.id] });
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Fehler",
        description: "Die Notiz konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Fehler beim Laden der Notizen. Bitte versuchen Sie es später erneut.
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Lädt Notizen...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Notizen</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Notiz hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neue Notiz</DialogTitle>
              </DialogHeader>
              <NoteForm 
                onSubmit={handleAddNote}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <NotesList notes={notes || []} />
        </CardContent>
      </Card>
    </div>
  );
}