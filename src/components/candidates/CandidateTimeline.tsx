import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { CurrentPosition } from "./timeline/CurrentPosition";
import { WorkHistory } from "./timeline/WorkHistory";
import { Education } from "./timeline/Education";
import { EditableSkills } from "./timeline/EditableSkills";
import { analyzeResumeWithGPT } from "@/utils/openai";
import { useQueryClient } from "@tanstack/react-query";
import { ResumeUpload } from "./ResumeUpload";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleResumeAnalyzed = async (data: any) => {
    try {
      // Insert work history entries if they don't exist
      if (data.workHistory && Array.isArray(data.workHistory)) {
        for (const entry of data.workHistory) {
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

      // Insert education entries if they don't exist
      if (data.education?.educationHistory && Array.isArray(data.education.educationHistory)) {
        for (const entry of data.education.educationHistory) {
          const { data: existingEntries } = await supabase
            .from('candidate_education')
            .select('*')
            .eq('candidate_id', candidate.id)
            .eq('institution', entry.institution)
            .eq('degree', entry.degree);

          if (!existingEntries || existingEntries.length === 0) {
            await supabase
              .from('candidate_education')
              .insert({
                candidate_id: candidate.id,
                institution: entry.institution,
                degree: entry.degree,
                field_of_study: entry.fieldOfStudy,
                start_date: entry.startDate,
                end_date: entry.endDate,
              });
          }
        }
      }

      // Update candidate skills if provided
      if (data.skills && Array.isArray(data.skills)) {
        const skillRatings = data.skills.map((skill: string) => ({
          name: skill,
          rating: 3, // Default rating
        }));

        await supabase
          .from('candidates')
          .update({
            skills: data.skills,
            skill_ratings: skillRatings,
          })
          .eq('id', candidate.id);
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["candidate-work-history", candidate.id] });
      queryClient.invalidateQueries({ queryKey: ["candidate-education", candidate.id] });
      queryClient.invalidateQueries({ queryKey: ["candidate", candidate.id] });

      toast({
        title: "Lebenslauf analysiert",
        description: "Die Informationen wurden erfolgreich extrahiert und gespeichert.",
      });
    } catch (error) {
      console.error('Error processing resume data:', error);
      toast({
        title: "Fehler",
        description: "Die Daten konnten nicht verarbeitet werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Werdegang</CardTitle>
        <div className="space-x-2">
          <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="current-position" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              Aktuelle Position
            </AccordionTrigger>
            <AccordionContent>
              <CurrentPosition 
                candidate={candidate} 
                onEntryClick={(entry) => {
                  setSelectedEntry(entry);
                  setDialogOpen(true);
                }}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="work-history" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              Berufserfahrung
            </AccordionTrigger>
            <AccordionContent>
              <WorkHistory 
                candidate={candidate} 
                onEntryClick={(entry) => {
                  setSelectedEntry(entry);
                  setDialogOpen(true);
                }}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              Ausbildung
            </AccordionTrigger>
            <AccordionContent>
              <Education 
                candidate={candidate} 
                onEntryClick={(entry) => {
                  setSelectedEntry(entry);
                  setDialogOpen(true);
                }}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="skills" className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              Fähigkeiten
            </AccordionTrigger>
            <AccordionContent>
              <EditableSkills candidate={candidate} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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