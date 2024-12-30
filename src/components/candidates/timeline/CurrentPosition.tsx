import { Briefcase } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import type { Candidate } from "@/types/database.types";

interface CurrentPositionProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function CurrentPosition({ candidate, onEntryClick }: CurrentPositionProps) {
  if (!candidate.position) return null;

  return (
    <TimelineEntry
      entry={{
        id: 0,
        position: candidate.position,
        company: candidate.company || "",
        start_date: new Date().toISOString(),
        is_current: true,
        description: "Aktuelle Position",
      }}
      icon={<Briefcase className="h-4 w-4 text-primary" />}
      isCurrent={true}
      onEntryClick={onEntryClick}
    />
  );
}