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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'screening':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'interview':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'offer':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'hired':
        return 'bg-emerald-500 hover:bg-emerald-600 text-white';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'submitted':
        return 20;
      case 'screening':
        return 40;
      case 'interview':
        return 60;
      case 'offer':
        return 80;
      case 'hired':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Eingereicht';
      case 'screening':
        return 'Vorauswahl';
      case 'interview':
        return 'Interview';
      case 'offer':
        return 'Angebot';
      case 'hired':
        return 'Eingestellt';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div>Lädt Bewerbungen...</div>;
  }

  return (
    <div className="space-y-6">
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
              <div key={application.id} className="p-4 bg-accent/20 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{application.jobs?.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Beworben am: {new Date(application.date_applied).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {getStatusLabel(application.status)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Fortschritt</div>
                  <Progress value={getStatusProgress(application.status)} className="h-2" />
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
    </div>
  );
}