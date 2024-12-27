import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplications } from "@/hooks/useApplications";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useJobs } from "@/hooks/useJobs";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CandidateApplicationsProps {
  candidateId: number;
}

export function CandidateApplications({ candidateId }: CandidateApplicationsProps) {
  const { data: applications, isLoading } = useApplications(candidateId);
  const { data: jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<string>("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddApplication = async () => {
    if (!selectedJob) return;

    try {
      const { error } = await supabase.from("applications").insert({
        candidate_id: candidateId,
        job_id: parseInt(selectedJob),
      });

      if (error) throw error;

      toast({
        title: "Bewerbung hinzugefügt",
        description: "Die Bewerbung wurde erfolgreich erstellt.",
      });
      setIsDialogOpen(false);
      setSelectedJob("");
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Bewerbung konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Lädt Bewerbungen...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bewerbungen</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Bewerbung hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Bewerbung</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Position auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs?.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddApplication} disabled={!selectedJob}>
                Bewerbung hinzufügen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
          {applications?.length === 0 && (
            <div className="text-center text-muted-foreground">
              Keine Bewerbungen vorhanden
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}