import { noteCategories } from "./noteCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyNote } from "lucide-react";

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

  const formatContent = (content: string) => {
    return content.split('\n\n').map((block, index) => {
      const [question, answer] = block.split('\n');
      return (
        <div key={index} className="mb-2">
          <div className="font-bold">{question}</div>
          <div>{answer}</div>
        </div>
      );
    });
  };

  // Group notes by category
  const notesByCategory = notes.reduce((acc, note) => {
    if (!acc[note.category]) {
      acc[note.category] = [];
    }
    acc[note.category].push(note);
    return acc;
  }, {} as Record<string, Note[]>);

  // Get categories that have notes
  const categoriesWithNotes = Object.keys(notesByCategory);

  if (categoriesWithNotes.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        Keine Notizen vorhanden
      </div>
    );
  }

  return (
    <Tabs defaultValue={categoriesWithNotes[0]} className="w-full">
      <TabsList className="w-full flex flex-wrap">
        {categoriesWithNotes.map((category) => (
          <TabsTrigger 
            key={category} 
            value={category}
            className="flex items-center gap-2"
          >
            <StickyNote className="h-4 w-4" />
            {noteCategories[category as keyof typeof noteCategories]?.label}
            <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {notesByCategory[category].length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {categoriesWithNotes.map((category) => (
        <TabsContent key={category} value={category} className="mt-4">
          <div className="space-y-4">
            {notesByCategory[category].map((note) => (
              <div key={note.id} className="p-4 bg-accent/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {formatDate(note.created_at)} - {note.created_by}
                  </div>
                </div>
                <div className="text-sm">
                  {formatContent(note.content)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}