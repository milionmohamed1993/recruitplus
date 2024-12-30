import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { useToast } from "@/hooks/use-toast";

interface ChecklistItem {
  id: number;
  category: string;
  item: string;
  completed: boolean;
}

interface CandidateChecklistProps {
  candidate: Candidate;
}

export function CandidateChecklist({ candidate }: CandidateChecklistProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchChecklistItems();
  }, [candidate.id]);

  const fetchChecklistItems = async () => {
    const { data, error } = await supabase
      .from('candidate_checklist')
      .select('*')
      .eq('candidate_id', candidate.id)
      .order('category');

    if (error) {
      console.error('Error fetching checklist items:', error);
      return;
    }

    if (!data || data.length === 0) {
      // Initialize checklist items if none exist
      await initializeChecklist();
      return;
    }

    setChecklistItems(data);
    updateProgress(data);
  };

  const initializeChecklist = async () => {
    const defaultItems = [
      // 1. Kandidatendaten
      { category: "Kandidatendaten", item: "Vollständige Kontaktdaten vorhanden" },
      { category: "Kandidatendaten", item: "Alle notwendigen Unterlagen vorhanden" },
      { category: "Kandidatendaten", item: "Berufliche Qualifikationen dokumentiert" },
      
      // 2. Pipeline-Status
      { category: "Pipeline-Status", item: "Kandidat in richtiger Pipeline-Phase" },
      { category: "Pipeline-Status", item: "Nächste Schritte definiert" },
      { category: "Pipeline-Status", item: "Kommunikation dokumentiert" },
      
      // 3. Interviews
      { category: "Interviews", item: "Interview-Termine geplant und bestätigt" },
      { category: "Interviews", item: "Feedback von Interviewern eingeholt" },
      { category: "Interviews", item: "Gesprächsergebnisse dokumentiert" },
      
      // 4. Bewertung
      { category: "Bewertung", item: "Qualifikationen mit Stelle abgeglichen" },
      { category: "Bewertung", item: "Kulturelle Passung geprüft" },
      { category: "Bewertung", item: "Stärken und Schwächen dokumentiert" },
      
      // 5. Entscheidung
      { category: "Entscheidung", item: "Stakeholder-Feedback eingeholt" },
      { category: "Entscheidung", item: "Kandidatenvergleich durchgeführt" },
      { category: "Entscheidung", item: "Finale Entscheidung dokumentiert" },
      
      // 6. Kommunikation
      { category: "Kommunikation", item: "Regelmäßige Status-Updates gegeben" },
      { category: "Kommunikation", item: "Finale Entscheidung kommuniziert" },
      { category: "Kommunikation", item: "Feedback zur Bewerbung gegeben" },
      
      // 7. Administration
      { category: "Administration", item: "Dokumentation vollständig" },
      { category: "Administration", item: "Compliance-Anforderungen erfüllt" },
      { category: "Administration", item: "Kandidatenprofil aktualisiert" },
      
      // 8. Nachbereitung
      { category: "Nachbereitung", item: "Talentpool-Eignung geprüft" },
      { category: "Nachbereitung", item: "Prozess-Learnings dokumentiert" },
      { category: "Nachbereitung", item: "Team-Feedback eingeholt" },
      
      // 9. Einstellung
      { category: "Einstellung", item: "Arbeitsvertrag versendet" },
      { category: "Einstellung", item: "Onboarding vorbereitet" },
      { category: "Einstellung", item: "Erster Arbeitstag organisiert" }
    ];

    const items = defaultItems.map(item => ({
      candidate_id: candidate.id,
      category: item.category,
      item: item.item,
      completed: false
    }));

    const { data, error } = await supabase
      .from('candidate_checklist')
      .insert(items)
      .select();

    if (error) {
      console.error('Error initializing checklist:', error);
      return;
    }

    setChecklistItems(data);
    updateProgress(data);
  };

  const updateProgress = (items: ChecklistItem[]) => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    setProgress(Math.round((completed / total) * 100));
  };

  const toggleItem = async (itemId: number, completed: boolean) => {
    const { error } = await supabase
      .from('candidate_checklist')
      .update({ 
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating checklist item:', error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
      return;
    }

    const updatedItems = checklistItems.map(item =>
      item.id === itemId ? { ...item, completed } : item
    );
    setChecklistItems(updatedItems);
    updateProgress(updatedItems);

    toast({
      title: completed ? "Aufgabe erledigt" : "Aufgabe offen",
      description: "Der Status wurde erfolgreich aktualisiert.",
    });
  };

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rekrutierungs-Checkliste</CardTitle>
        <div className="mt-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Fortschritt</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedItems).map(([category, items]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-lg font-semibold">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={`item-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.item}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}