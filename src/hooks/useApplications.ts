import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Application } from "@/types/database.types";

export function useApplications(candidateId: number) {
  return useQuery({
    queryKey: ["applications", candidateId],
    queryFn: async (): Promise<Application[]> => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          jobs (
            title
          )
        `)
        .eq("candidate_id", candidateId);

      if (error) throw error;
      return data;
    },
  });
}