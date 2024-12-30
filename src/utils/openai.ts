import { supabase } from "@/lib/supabase";

export async function analyzeResumeWithGPT(text: string, pdfImages: string[] = []) {
  try {
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('key', 'OPENAI_API_KEY')
      .single();

    if (secretError) throw secretError;

    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: { 
        text, 
        pdfImages,
        candidateId: window.location.pathname.split('/').pop() 
      },
    });

    if (error) throw error;

    return JSON.stringify(data.result);
  } catch (error) {
    console.error("Error in analyzeResumeWithGPT:", error);
    throw error;
  }
}