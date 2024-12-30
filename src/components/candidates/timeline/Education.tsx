import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { TimelineEntry } from "./TimelineEntry";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";

interface EducationProps {
  candidate: Candidate;
  onEntryClick: (entry: any) => void;
}

export function Education({ candidate, onEntryClick }: EducationProps) {
  const { data: educationHistory, isError } = useQuery({
    queryKey: ["education-history", candidate.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("candidate_education")
          .select("*")
          .eq("candidate_id", candidate.id)
          .order("end_date", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching education history:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error in education history query:", error);
        return [];
      }
    },
    retry: false
  });

  // If there's no education history and no legacy education data, don't render anything
  if ((!educationHistory || educationHistory.length === 0) && !candidate.education) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Show education history from the dedicated table if available */}
      {educationHistory?.map((entry) => (
        <TimelineEntry
          key={entry.id}
          entry={{
            id: entry.id,
            position: entry.degree,
            company: entry.institution,
            start_date: entry.start_date,
            end_date: entry.end_date,
            description: entry.field_of_study,
          }}
          icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
          onEntryClick={onEntryClick}
        />
      ))}
      
      {/* Show legacy education data if no history exists */}
      {(!educationHistory || educationHistory.length === 0) && candidate.education && (
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
      )}
    </div>
  );
}