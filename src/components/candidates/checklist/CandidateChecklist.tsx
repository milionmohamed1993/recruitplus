import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion } from "@/components/ui/accordion";
import type { Candidate } from "@/types/database.types";
import { useChecklist } from "./useChecklist";
import { ChecklistCategory } from "./ChecklistCategory";

interface CandidateChecklistProps {
  candidate: Candidate;
}

export function CandidateChecklist({ candidate }: CandidateChecklistProps) {
  const { checklistItems, progress, toggleItem } = useChecklist(candidate);

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklistItems>);

  const categories = [
    "Kandidatendaten",
    "Pipeline-Status",
    "Interviews",
    "Bewertung",
    "Entscheidung",
    "Kommunikation",
    "Einstellung",
    "Nachbereitung",
    "Administration"
  ];

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
          {categories.map((category) => (
            groupedItems[category] && (
              <ChecklistCategory
                key={category}
                category={category}
                items={groupedItems[category]}
                onToggleItem={toggleItem}
              />
            )
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}