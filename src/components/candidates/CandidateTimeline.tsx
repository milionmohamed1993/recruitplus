import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrentPosition } from "./timeline/CurrentPosition";
import { WorkHistory } from "./timeline/WorkHistory";
import { Education } from "./timeline/Education";
import { EditableSkills } from "./timeline/EditableSkills";
import { analyzeResumeWithGPT } from "@/utils/openai";
import { useQueryClient } from "@tanstack/react-query";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const parseResumeAndUpdateWorkHistory = async () => {
      try {
        // Get candidate attachments
        const { data: attachments } = await supabase
          .from('candidate_attachments')
          .select('*')
          .eq('candidate_id', candidate.id);

        if (!attachments || attachments.length === 0) return;

        // Get the resume text from the first attachment that has analysis
        const resumeText = attachments[0]?.analysis;
        if (!resumeText) return;

        // Analyze the resume
        const result = await analyzeResumeWithGPT(resumeText);
        const parsedData = JSON.parse(result);

        // Insert work history entries if they don't exist
        if (parsedData.workHistory && Array.isArray(parsedData.workHistory)) {
          for (const entry of parsedData.workHistory) {
            const { data: existingEntries } = await supabase
              .from('candidate_work_history')
              .select('*')
              .eq('candidate_id', candidate.id)
              .eq('position', entry.position)
              .eq('company', entry.company);

            if (!existingEntries || existingEntries.length === 0) {
              await supabase
                .from('candidate_work_history')
                .insert({
                  candidate_id: candidate.id,
                  position: entry.position,
                  company: entry.company,
                  start_date: entry.startDate,
                  end_date: entry.endDate,
                  description: entry.description,
                });
            }
          }
        }

        // Invalidate queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["candidate-work-history", candidate.id] });
      } catch (error) {
        console.error('Error parsing resume:', error);
      }
    };

    parseResumeAndUpdateWorkHistory();
  }, [candidate.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Werdegang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <CurrentPosition 
            candidate={candidate} 
            onEntryClick={(entry) => {
              setSelectedEntry(entry);
              setDialogOpen(true);
            }}
          />

          <WorkHistory 
            candidate={candidate} 
            onEntryClick={(entry) => {
              setSelectedEntry(entry);
              setDialogOpen(true);
            }}
          />

          <Education 
            candidate={candidate} 
            onEntryClick={(entry) => {
              setSelectedEntry(entry);
              setDialogOpen(true);
            }}
          />

          <EditableSkills candidate={candidate} />
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