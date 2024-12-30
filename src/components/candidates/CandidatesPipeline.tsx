import { Card } from "@/components/ui/card";
import { useCandidates } from "@/hooks/useCandidates";
import { useParams } from "react-router-dom";

const stages = [
  { id: "new", label: "Neu", color: "bg-blue-100 border-blue-500 text-blue-700" },
  { id: "screening", label: "Vorauswahl", color: "bg-yellow-100 border-yellow-500 text-yellow-700" },
  { id: "interview", label: "Interview", color: "bg-purple-100 border-purple-500 text-purple-700" },
  { id: "offer", label: "Angebot", color: "bg-green-100 border-green-500 text-green-700" },
  { id: "hired", label: "Eingestellt", color: "bg-emerald-100 border-emerald-500 text-emerald-700" },
];

export function CandidatesPipeline() {
  const { data: candidates, isLoading } = useCandidates();
  const { id: currentCandidateId } = useParams();

  if (isLoading) {
    return <div>Lädt Kandidaten...</div>;
  }

  const filteredCandidates = currentCandidateId
    ? candidates?.filter((c) => c.id === parseInt(currentCandidateId))
    : candidates;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {stages.map((stage) => (
        <div key={stage.id} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{stage.label}</h3>
            <span className="text-muted-foreground text-sm">
              {filteredCandidates?.filter((c) => c.status === stage.id).length || 0}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {filteredCandidates
              ?.filter((candidate) => candidate.status === stage.id)
              .map((candidate) => (
                <Card 
                  key={candidate.id} 
                  className={`p-4 border-l-4 ${stage.color}`}
                >
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