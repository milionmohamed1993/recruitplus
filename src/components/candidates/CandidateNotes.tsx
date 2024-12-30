import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";

interface CandidateNotesProps {
  candidate: Candidate;
}

interface Note {
  id: number;
  candidate_id: number;
  content: string;
  category: string;
  created_at: string;
  created_by: string;
}

const noteCategories = {
  initial_contact: {
    label: "Erstkontakt",
    questions: [
      "Wie wurde der Kandidat gefunden?",
      "Hat der Kandidat Interesse signalisiert?",
      "Wurde ein Erstgespräch vereinbart?",
      "Bemerkungen zur ersten Kommunikation:",
    ],
  },
  phone_interview: {
    label: "Telefoninterview",
    questions: [
      "Was motiviert den Kandidaten zur Bewerbung?",
      "Passen die Qualifikationen und Erfahrungen zur Stelle?",
      "Welche Gehaltsvorstellungen hat der Kandidat?",
      "Besondere Stärken oder Schwächen:",
      "Fragen des Kandidaten:",
    ],
  },
  technical_interview: {
    label: "Fachgespräch",
    questions: [
      "Einschätzung der Fachkenntnisse:",
      "Kulturelle Passung zum Team:",
      "Offene Punkte für nächstes Gespräch:",
      "Arbeitsprobe/Test besprochen:",
    ],
  },
  offer: {
    label: "Angebot",
    questions: [
      "Reaktion auf das Angebot:",
      "Details zu Verhandlungen:",
      "Erforderliche zusätzliche Unterlagen:",
    ],
  },
  rejection: {
    label: "Abgelehnt",
    questions: [
      "Ablehnungsgrund:",
      "Feedback des Kandidaten:",
      "Potenzial für zukünftige Positionen:",
    ],
  },
};

export function CandidateNotes({ candidate }: CandidateNotesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [noteContent, setNoteContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ["candidate-notes", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_notes")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });

  const handleAddNote = async () => {
    if (!selectedCategory || !noteContent.trim()) return;

    try {
      const { error } = await supabase.from("candidate_notes").insert({
        candidate_id: candidate.id,
        content: noteContent,
        category: selectedCategory,
        created_by: "System User", // In a real app, this would be the logged-in user
      });

      if (error) throw error;

      toast({
        title: "Notiz hinzugefügt",
        description: "Die Notiz wurde erfolgreich erstellt.",
      });
      setIsDialogOpen(false);
      setNoteContent("");
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["candidate-notes", candidate.id] });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Notiz konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <div>Lädt Notizen...</div>;
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(noteCategories).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCategory && (
                  <div className="space-y-4">
                    {noteCategories[selectedCategory as keyof typeof noteCategories].questions.map(
                      (question, index) => (
                        <div key={index} className="space-y-2">
                          <label className="text-sm font-medium">{question}</label>
                          <Textarea
                            placeholder="Ihre Antwort..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleAddNote} disabled={!selectedCategory || !noteContent.trim()}>
                  Notiz hinzufügen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notes?.map((note) => (
              <div key={note.id} className="p-4 bg-accent/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">
                    {noteCategories[note.category as keyof typeof noteCategories]?.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(note.created_at)} - {note.created_by}
                  </div>
                </div>
                <div className="text-sm whitespace-pre-wrap">{note.content}</div>
              </div>
            ))}
            {(!notes || notes.length === 0) && (
              <div className="text-center text-muted-foreground">
                Keine Notizen vorhanden
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}