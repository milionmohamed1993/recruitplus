import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: async (): Promise<Candidate[]> => {
      console.log("Fetching candidates...");
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
      }

      console.log("Candidates fetched successfully:", data);
      return data;
    },
  });
}