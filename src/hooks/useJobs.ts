import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@/types/database.types";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}