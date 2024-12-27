import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";

interface CandidateApplicationsProps {
  candidateId: number;
}

export function CandidateApplications({ candidateId }: CandidateApplicationsProps) {
  const { data: applications, isLoading } = useApplications(candidateId);

  if (isLoading) {
    return <div>Lädt Bewerbungen...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bewerbungen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications?.map((application) => (
            <div key={application.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{application.jobs?.title}</div>
                <div className="text-sm text-muted-foreground">
                  Beworben am: {new Date(application.date_applied).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm">
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}