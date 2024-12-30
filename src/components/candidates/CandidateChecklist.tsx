import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Check, X, CheckSquare } from "lucide-react";
import type { Candidate } from "@/types/database.types";

interface CandidateChecklistProps {
  candidate: Candidate;
}

interface ChecklistItem {
  id: number;
  candidate_id: number;
  category: string;
  item: string;
  completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  updated_at: string;
}

type ChecklistCategories = Record<string, ChecklistItem[]>;

export function CandidateChecklist({ candidate }: CandidateChecklistProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: checklistItems, isLoading } = useQuery({
    queryKey: ["candidate-checklist", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_checklist")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching checklist:", error);
        toast({
          title: "Fehler",
          description: "Checkliste konnte nicht geladen werden.",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });

  const toggleChecklistItem = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("candidate_checklist")
        .update({
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null,
          completed_by: "System User", // In a real app, this would be the logged-in user
        })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["candidate-checklist", candidate.id] });
      
      toast({
        title: completed ? "Aufgabe abgeschlossen" : "Aufgabe wieder geöffnet",
        description: "Die Checkliste wurde aktualisiert.",
      });
    } catch (error) {
      console.error("Error updating checklist item:", error);
      toast({
        title: "Fehler",
        description: "Die Aufgabe konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Lädt Checkliste...</div>;
  }

  const categories = checklistItems?.reduce((acc: ChecklistCategories, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Checkliste
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(categories || {}).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="font-medium mb-3">{category}</h3>
              <div className="space-y-2">
                {items.map((item: ChecklistItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-accent/20 rounded-lg"
                  >
                    <span className="flex-1">{item.item}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleChecklistItem(item.id, !item.completed)}
                      className={item.completed ? "text-green-500" : "text-red-500"}
                    >
                      {item.completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}