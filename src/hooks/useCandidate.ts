import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/database.types";
import { toast } from "@/components/ui/use-toast";

export function useCandidate(id: number) {
  return useQuery({
    queryKey: ["candidate", id],
    queryFn: async (): Promise<Candidate | null> => {
      try {
        console.log("Fetching candidate details...");
        const { data, error } = await supabase
          .from("candidates")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching candidate:", error);
          toast({
            title: "Error",
            description: "Could not load candidate details. Please try again.",
            variant: "destructive",
          });
          throw error;
        }

        if (!data) {
          console.log("No candidate found with ID:", id);
          return null;
        }

        console.log("Candidate details fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in useCandidate hook:", error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });
}