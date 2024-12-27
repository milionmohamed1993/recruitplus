import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading } = useCandidate(Number(id));

  if (isLoading) {
    return <div>Lädt Kandidatendetails...</div>;
  }

  if (!candidate) {
    return <div>Kandidat nicht gefunden</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{candidate.name}</h1>
          <Badge variant="secondary">{candidate.status}</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div>{candidate.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Telefon</div>
                <div>{candidate.phone || "Nicht angegeben"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Position</div>
                <div>{candidate.position || "Nicht angegeben"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Berufliche Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Firma</div>
                <div>{candidate.company || "Nicht angegeben"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Abteilung</div>
                <div>{candidate.department || "Nicht angegeben"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Branche</div>
                <div>{candidate.industry || "Nicht angegeben"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Erfahrung</div>
                <div>{candidate.experience || "Nicht angegeben"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ausbildung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Abschluss</div>
                <div>{candidate.education || "Nicht angegeben"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Universität</div>
                <div>{candidate.university || "Nicht angegeben"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}