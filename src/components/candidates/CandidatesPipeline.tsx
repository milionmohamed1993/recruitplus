import { Card } from "@/components/ui/card";
import { useCandidates } from "@/hooks/useCandidates";

const stages = [
  { id: "new", label: "Neu" },
  { id: "screening", label: "Vorauswahl" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Angebot" },
  { id: "hired", label: "Eingestellt" },
];

export function CandidatesPipeline() {
  const { data: candidates, isLoading } = useCandidates();

  if (isLoading) {
    return <div>Lädt Kandidaten...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{stage.label}</h3>
            <span className="text-muted-foreground text-sm">
              {candidates?.filter((c) => c.status === stage.id).length || 0}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {candidates
              ?.filter((candidate) => candidate.status === stage.id)
              .map((candidate) => (
                <Card key={candidate.id} className="p-4">
                  <div className="font-medium">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {candidate.position}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}