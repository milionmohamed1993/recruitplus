import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/types/database.types";

interface ChecklistItem {
  id: number;
  category: string;
  item: string;
  completed: boolean;
}

export function useChecklist(candidate: Candidate) {
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
      await initializeChecklist();
      return;
    }

    setChecklistItems(data);
    updateProgress(data);
  };

  const defaultItems = [
    // 1. Kandidatendaten
    { category: "Kandidatendaten", item: "Berufliche Qualifikationen dokumentiert" },
    { category: "Kandidatendaten", item: "Vollständige Kontaktdaten vorhanden" },
    { category: "Kandidatendaten", item: "Alle notwendigen Unterlagen vorhanden" },
    
    // 2. Pipeline-Status
    { category: "Pipeline-Status", item: "Kandidat in richtiger Pipeline-Phase" },
    { category: "Pipeline-Status", item: "Kommunikation dokumentiert" },
    { category: "Pipeline-Status", item: "Nächste Schritte definiert" },
    
    // 3. Interviews
    { category: "Interviews", item: "Interview-Termine geplant und bestätigt" },
    { category: "Interviews", item: "Feedback von Interviewern eingeholt" },
    { category: "Interviews", item: "Gesprächsergebnisse dokumentiert" },
    
    // 4. Bewertung
    { category: "Bewertung", item: "Kulturelle Passung geprüft" },
    { category: "Bewertung", item: "Stärken und Schwächen dokumentiert" },
    { category: "Bewertung", item: "Qualifikationen mit Stelle abgeglichen" },
    
    // 5. Entscheidung
    { category: "Entscheidung", item: "Kandidatenvergleich durchgeführt" },
    { category: "Entscheidung", item: "Stakeholder-Feedback eingeholt" },
    { category: "Entscheidung", item: "Finale Entscheidung dokumentiert" },
    
    // 6. Kommunikation
    { category: "Kommunikation", item: "Feedback zur Bewerbung gegeben" },
    { category: "Kommunikation", item: "Finale Entscheidung kommuniziert" },
    { category: "Kommunikation", item: "Regelmäßige Status-Updates gegeben" },
    
    // 7. Einstellung
    { category: "Einstellung", item: "Arbeitsvertrag versendet" },
    { category: "Einstellung", item: "Erster Arbeitstag organisiert" },
    { category: "Einstellung", item: "Onboarding vorbereitet" },
    
    // 8. Nachbereitung
    { category: "Nachbereitung", item: "Talentpool-Eignung geprüft" },
    { category: "Nachbereitung", item: "Prozess-Learnings dokumentiert" },
    { category: "Nachbereitung", item: "Team-Feedback eingeholt" },
    
    // 9. Administration
    { category: "Administration", item: "Kandidatenprofil aktualisiert" },
    { category: "Administration", item: "Dokumentation vollständig" },
    { category: "Administration", item: "Compliance-Anforderungen erfüllt" }
  ];

  const initializeChecklist = async () => {
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

  return {
    checklistItems,
    progress,
    toggleItem
  };
}