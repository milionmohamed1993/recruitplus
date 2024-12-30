import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";

export function useCandidate(id: number) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: async (): Promise<Candidate> => {
      console.log("Fetching candidate details...");
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching candidate:", error);
        throw error;
      }

      console.log("Candidate details fetched successfully:", data);
      return data;
    },
  });
}