import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { checklistCategories } from "./checklistCategories";
import type { Candidate } from "@/types/database.types";
import { CheckSquare, Square } from "lucide-react";

interface CandidateChecklistProps {
  candidate: Candidate;
}

export function CandidateChecklist({ candidate }: CandidateChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadChecklist = async () => {
      const { data, error } = await supabase
        .from("candidate_notes")
        .select("content")
        .eq("candidate_id", candidate.id)
        .eq("category", "checklist")
        .single();

      if (data) {
        try {
          setCheckedItems(JSON.parse(data.content));
        } catch (e) {
          console.error("Error parsing checklist data:", e);
        }
      }
    };

    loadChecklist();
  }, [candidate.id]);

  const handleCheckItem = async (categoryKey: string, itemIndex: number) => {
    const itemKey = `${categoryKey}_${itemIndex}`;
    const newCheckedItems = {
      ...checkedItems,
      [itemKey]: !checkedItems[itemKey],
    };
    setCheckedItems(newCheckedItems);

    try {
      const { error } = await supabase
        .from("candidate_notes")
        .upsert({
          candidate_id: candidate.id,
          category: "checklist",
          content: JSON.stringify(newCheckedItems),
          created_by: "System",
        })
        .eq("category", "checklist")
        .eq("candidate_id", candidate.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving checklist:", error);
      toast({
        title: "Fehler",
        description: "Die Checkliste konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const calculateProgress = () => {
    const totalItems = Object.values(checklistCategories).reduce(
      (sum, category) => sum + category.items.length,
      0
    );
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const isComplete = calculateProgress() === 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Rekrutierungs-Checkliste</CardTitle>
        <div className="text-sm font-medium">
          Fortschritt: {calculateProgress()}%
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(checklistCategories).map(([categoryKey, category]) => (
            <div key={categoryKey} className="space-y-3">
              <h3 className="font-medium text-lg">{category.label}</h3>
              <div className="space-y-2">
                {category.items.map((item, index) => {
                  const itemKey = `${categoryKey}_${index}`;
                  return (
                    <div
                      key={itemKey}
                      className="flex items-start space-x-2"
                    >
                      <Checkbox
                        id={itemKey}
                        checked={checkedItems[itemKey] || false}
                        onCheckedChange={() => handleCheckItem(categoryKey, index)}
                      />
                      <label
                        htmlFor={itemKey}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {isComplete && (
          <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-700 dark:text-green-300 text-sm">
              Alle Punkte der Checkliste wurden abgearbeitet. Der Rekrutierungsprozess kann nun abgeschlossen werden.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}