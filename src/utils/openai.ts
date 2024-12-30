import { supabase } from "@/lib/supabase";

export async function analyzeResumeWithGPT(text: string) {
  try {
    console.log('Starting resume analysis...');
    
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: { text }
    });

    if (error) {
      console.error('Error calling analyze-resume function:', error);
      throw error;
    }

    if (data.error) {
      console.error('Error from analyze-resume function:', data.error);
      throw new Error(data.error);
    }

    console.log('Resume analysis completed successfully');
    return JSON.stringify(data.result);
  } catch (error) {
    console.error('Error in analyzeResumeWithGPT:', error);
    throw error;
  }
}