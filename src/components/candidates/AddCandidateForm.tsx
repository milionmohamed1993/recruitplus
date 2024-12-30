import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { WorkReferenceFields } from "./WorkReferenceFields";
import { ResumeUpload } from "./ResumeUpload";
import { SkillsInput } from "./SkillsInput";

export function AddCandidateForm() {
  // Personal Information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("other");

  // Professional Information
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [university, setUniversity] = useState("");

  // Work Reference
  const [workReference, setWorkReference] = useState("");
  const [workReferenceEvaluation, setWorkReferenceEvaluation] = useState("");
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [skills, setSkills] = useState<{ name: string; rating: number }[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

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
          gender
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

  return (
    <form id="add-candidate-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Persönliche Informationen</h3>
          <PersonalInfoSection
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            birthdate={birthdate}
            setBirthdate={setBirthdate}
            address={address}
            setAddress={setAddress}
            nationality={nationality}
            setNationality={setNationality}
            location={location}
            setLocation={setLocation}
            gender={gender}
            setGender={setGender}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Berufliche Informationen</h3>
          <ProfessionalInfoFields
            position={position}
            setPosition={setPosition}
            company={company}
            setCompany={setCompany}
            department={department}
            setDepartment={setDepartment}
            industry={industry}
            setIndustry={setIndustry}
            experience={experience}
            setExperience={setExperience}
            education={education}
            setEducation={setEducation}
            university={university}
            setUniversity={setUniversity}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Fähigkeiten</h3>
          <SkillsInput 
            skills={skills} 
            setSkills={setSkills}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Arbeitszeugnis & Zertifikate</h3>
          <WorkReferenceFields
            workReference={workReference}
            setWorkReference={setWorkReference}
            workReferenceEvaluation={workReferenceEvaluation}
            setWorkReferenceEvaluation={setWorkReferenceEvaluation}
            onFileSelect={handleReferenceFileSelect}
            files={referenceFiles}
            onRemoveFile={handleRemoveReferenceFile}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Lebenslauf (Optional)</h3>
          <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
        </div>
      </div>
    </form>
  );
}
