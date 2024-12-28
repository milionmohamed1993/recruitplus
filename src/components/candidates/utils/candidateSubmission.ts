import { supabase } from "@/lib/supabase";
import { CandidateFormData } from "../types/CandidateFormTypes";

export async function handleCandidateSubmission(
  formData: CandidateFormData,
  files: FileList | null | undefined
) {
  try {
    // Format birthdate to ISO format if it exists
    const formattedBirthdate = formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : null;

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        ...formData,
        birthdate: formattedBirthdate,
        status: "new",
      })
      .select();

    if (error) throw error;

    // After successfully creating the candidate, upload any attachments
    if (data && data[0] && files && files.length > 0) {
      const candidateId = data[0].id;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          continue;
        }

        const { error: attachmentError } = await supabase
          .from('candidate_attachments')
          .insert({
            candidate_id: candidateId,
            file_name: file.name,
            file_path: fileName,
            file_type: file.type,
          });

        if (attachmentError) {
          console.error('Error saving attachment record:', attachmentError);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten" };
  }
}