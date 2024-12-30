import { noteCategories } from "./noteCategories";

interface Note {
  id: number;
  candidate_id: number;
  content: string;
  category: string;
  created_at: string;
  created_by: string;
}

interface NotesListProps {
  notes: Note[];
}

export function NotesList({ notes }: NotesListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
  );
}