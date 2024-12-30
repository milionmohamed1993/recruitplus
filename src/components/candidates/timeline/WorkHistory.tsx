import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";

interface WorkHistoryProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function WorkHistory({ candidate, onEntryClick }: WorkHistoryProps) {
  const { data: workHistory } = useQuery({
    queryKey: ["candidate-work-history", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  if (!workHistory?.length) return null;

  return (
    <>
      {workHistory.map((entry) => (
        <TimelineEntry
          key={entry.id}
          entry={entry}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          onEntryClick={onEntryClick}
        />
      ))}
    </>
  );
}