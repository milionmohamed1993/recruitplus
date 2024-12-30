import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import type { Candidate } from "@/types/database.types";
import { supabase } from "@/lib/supabase";

interface CurrentPositionProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function CurrentPosition({ candidate, onEntryClick }: CurrentPositionProps) {
  const { data: currentPosition } = useQuery({
    queryKey: ["current-position", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .eq("is_current", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching current position:", error);
        return null;
      }
      
      return data;
    },
  });

  if (!candidate.position) return null;

  return (
    <TimelineEntry
      entry={{
        id: 0,
        position: candidate.position,
        company: candidate.company || "",
        start_date: currentPosition?.start_date || new Date().toISOString(),
        is_current: true,
        description: "Aktuelle Position",
      }}
      icon={<Briefcase className="h-4 w-4 text-primary" />}
      isCurrent={true}
      onEntryClick={onEntryClick}
    />
  );
}