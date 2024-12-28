import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  const { data: workHistory } = useQuery({
    queryKey: ["candidate-work-history", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Werdegang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Current Position */}
          {candidate.position && (
            <div className="relative pl-8 pb-8 border-l-2 border-primary">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-primary rounded-full">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">{candidate.position}</div>
                <div className="text-sm text-muted-foreground">{candidate.company}</div>
                <Badge variant="outline">Aktuelle Position</Badge>
              </div>
            </div>
          )}

          {/* Work History */}
          {workHistory?.map((entry) => (
            <div key={entry.id} className="relative pl-8 pb-8 border-l-2 border-muted">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">{entry.position}</div>
                <div className="text-sm text-muted-foreground">{entry.company}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(entry.start_date)} - {entry.is_current ? "Heute" : formatDate(entry.end_date)}
                </div>
                {entry.description && (
                  <div className="text-sm text-muted-foreground">{entry.description}</div>
                )}
              </div>
            </div>
          ))}

          {/* Education */}
          {candidate.education && (
            <div className="relative pl-8 pb-8 border-l-2 border-muted">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">{candidate.education}</div>
                {candidate.university && (
                  <div className="text-sm text-muted-foreground">
                    {candidate.university}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="relative pl-8 border-l-2 border-muted">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">Fähigkeiten</div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}