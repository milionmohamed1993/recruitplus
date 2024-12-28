import { supabase } from "@/lib/supabase";

export async function analyzeResumeWithGPT(text: string) {
  try {
    console.log('Starting resume analysis...');
    
    const { data: response, error } = await supabase.functions.invoke('analyze-resume', {
      body: { text }
    });

    if (error) {
      console.error('Supabase Function Error:', error);
      throw new Error(`Failed to analyze resume: ${error.message}`);
    }

    return response;
  } catch (error) {
    console.error('Error in analyzeResumeWithGPT:', error);
    throw error;
  }
}