import { GraduationCap } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import type { Candidate } from "@/types/database.types";

interface EducationProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function Education({ candidate, onEntryClick }: EducationProps) {
  if (!candidate.education) return null;

  return (
    <TimelineEntry
      entry={{
        id: -1,
        position: candidate.education,
        company: candidate.university || "",
        start_date: new Date().toISOString(),
      }}
      icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
      onEntryClick={onEntryClick}
    />
  );
}