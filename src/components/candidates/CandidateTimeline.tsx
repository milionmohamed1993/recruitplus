import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimelineEntry } from "./timeline/TimelineEntry";
import { SkillsSection } from "./timeline/SkillsSection";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Werdegang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Current Position */}
          {candidate.position && (
            <TimelineEntry
              entry={{
                id: 0,
                position: candidate.position,
                company: candidate.company || "",
                start_date: new Date().toISOString(),
                description: "Aktuelle Position",
              }}
              icon={<Briefcase className="h-4 w-4 text-primary" />}
              isCurrent={true}
              onEntryClick={(entry) => {
                setSelectedEntry(entry);
                setDialogOpen(true);
              }}
            />
          )}

          {/* Work History */}
          {workHistory?.map((entry) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
              onEntryClick={(entry) => {
                setSelectedEntry(entry);
                setDialogOpen(true);
              }}
            />
          ))}

          {/* Education */}
          {candidate.education && (
            <TimelineEntry
              entry={{
                id: -1,
                position: candidate.education,
                company: candidate.university || "",
                start_date: new Date().toISOString(),
              }}
              icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
              onEntryClick={(entry) => {
                setSelectedEntry(entry);
                setDialogOpen(true);
              }}
            />
          )}

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <SkillsSection skills={candidate.skills} />
          )}
        </div>
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEntry?.position}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEntry?.company && (
              <div className="text-sm text-muted-foreground">
                {selectedEntry.company}
              </div>
            )}
            {selectedEntry?.description && (
              <div className="text-sm text-muted-foreground">
                {selectedEntry.description}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}