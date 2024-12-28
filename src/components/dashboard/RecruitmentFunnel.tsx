import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function RecruitmentFunnel() {
  const stages = [
    { name: "Applied", count: 86, percentage: 100 },
    { name: "Screening", count: 64, percentage: 74 },
    { name: "Interview", count: 42, percentage: 49 },
    { name: "Technical", count: 28, percentage: 33 },
    { name: "Offer", count: 12, percentage: 14 },
    { name: "Hired", count: 8, percentage: 9 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recruitment Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{stage.name}</div>
                <div className="text-sm text-muted-foreground">{stage.count} candidates</div>
              </div>
              <Progress value={stage.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}