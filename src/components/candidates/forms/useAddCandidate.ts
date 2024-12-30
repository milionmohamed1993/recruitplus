import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function useAddCandidate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("other");
  const [source, setSource] = useState("Direct");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [university, setUniversity] = useState("");
  const [workReference, setWorkReference] = useState("");
  const [workReferenceEvaluation, setWorkReferenceEvaluation] = useState("");
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [skills, setSkills] = useState<{ name: string; rating: number }[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().split('T')[0] : null;

      const { data, error } = await supabase
        .from("candidates")
        .insert({
          name,
          email,
          phone,
          position,
          birthdate: formattedBirthdate,
          address,
          nationality,
          location,
          company,
          department,
          industry,
          experience,
          education,
          university,
          status: "new",
          work_reference: workReference,
          work_reference_evaluation: workReferenceEvaluation,
          skills: skills.map(skill => skill.name),
          skill_ratings: skills,
          gender,
          source
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const candidateId = data[0].id;
        
        // Upload resume files
        const resumeFiles = document.querySelectorAll<HTMLInputElement>('#resume-upload');
        const resumeFileList = resumeFiles[0]?.files;
        
        if (resumeFileList) {
          for (let i = 0; i < resumeFileList.length; i++) {
            const file = resumeFileList[i];
            const fileName = `${Date.now()}_${file.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('attachments')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading resume:', uploadError);
              continue;
            }

            await supabase
              .from('candidate_attachments')
              .insert({
                candidate_id: candidateId,
                file_name: file.name,
                file_path: fileName,
                file_type: file.type,
              });
          }
        }

        // Upload reference files
        if (referenceFiles) {
          for (const file of referenceFiles) {
            const fileName = `${Date.now()}_${file.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('attachments')
              .upload(fileName, file);

            if (uploadError) {
              console.error('Error uploading reference:', uploadError);
              continue;
            }

            await supabase
              .from('candidate_attachments')
              .insert({
                candidate_id: candidateId,
                file_name: file.name,
                file_path: fileName,
                file_type: file.type,
              });
          }
        }
      }

      toast({
        title: "Kandidat hinzugefügt",
        description: "Der Kandidat wurde erfolgreich hinzugefügt.",
      });
      navigate("/candidates");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Fehler",
        description: "Beim Hinzufügen des Kandidaten ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  const handleResumeAnalyzed = async (data: any) => {
    if (data.personalInfo) {
      setName(data.personalInfo.name || "");
      setEmail(data.personalInfo.email || "");
      setPhone(data.personalInfo.phone || "");
      if (data.personalInfo.birthdate) {
        try {
          const date = new Date(data.personalInfo.birthdate);
          if (!isNaN(date.getTime())) {
            setBirthdate(date.toISOString().split('T')[0]);
          }
        } catch (e) {
          console.log("Could not parse birthdate:", e);
        }
      }
      setAddress(data.personalInfo.address || "");
      setNationality(data.personalInfo.nationality || "");
      setLocation(data.personalInfo.location || "");
      setSource(data.personalInfo.source || "Direct");
    }

    if (data.professionalInfo) {
      setPosition(data.professionalInfo.position || "");
      setCompany(data.professionalInfo.company || "");
      setDepartment(data.professionalInfo.department || "");
      setIndustry(data.professionalInfo.industry || "");
      setExperience(data.professionalInfo.experience || "");
    }

    if (data.education) {
      setEducation(data.education.degree || "");
      setUniversity(data.education.university || "");
    }

    if (data.skills) {
      setSkills(data.skills);
    }

    if (data.workReferenceEvaluation) {
      setWorkReferenceEvaluation(data.workReferenceEvaluation);
    }

    toast({
      title: "Lebenslauf analysiert",
      description: "Die Informationen wurden erfolgreich extrahiert.",
    });
  };

  const handleReferenceFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setReferenceFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveReferenceFile = (index: number) => {
    setReferenceFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return {
    formData: {
      name, setName,
      email, setEmail,
      phone, setPhone,
      birthdate, setBirthdate,
      address, setAddress,
      nationality, setNationality,
      location, setLocation,
      gender, setGender,
      source, setSource,
      position, setPosition,
      company, setCompany,
      department, setDepartment,
      industry, setIndustry,
      experience, setExperience,
      education, setEducation,
      university, setUniversity,
      workReference, setWorkReference,
      workReferenceEvaluation, setWorkReferenceEvaluation,
      skills, setSkills,
      referenceFiles
    },
    handlers: {
      handleSubmit,
      handleResumeAnalyzed,
      handleReferenceFileSelect,
      handleRemoveReferenceFile
    }
  };
}