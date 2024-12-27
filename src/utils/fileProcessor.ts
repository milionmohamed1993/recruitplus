import { supabase } from "@/lib/supabase";
import { extractTextFromPDF } from "./pdfExtractor";

export async function processResumeFile(file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error('Failed to upload file to storage');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  const response = await fetch(publicUrl);
  const arrayBuffer = await response.arrayBuffer();

  let extractedText: string;
  if (file.type === 'application/pdf') {
    extractedText = await extractTextFromPDF(arrayBuffer);
  } else {
    extractedText = await new Response(arrayBuffer).text();
  }

  return extractedText;
}