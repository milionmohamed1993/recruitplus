import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { WorkReferenceFields } from "./WorkReferenceFields";
import { ResumeUpload } from "./ResumeUpload";
import { Badge } from "@/components/ui/badge";

export function AddCandidateForm() {
  // Personal Information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");

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
  const [skills, setSkills] = useState<string[]>([]);

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
          skills,
        })
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const candidateId = data[0].id;
        const files = document.querySelectorAll<HTMLInputElement>('#resume-upload');
        const fileList = files[0]?.files;
        
        if (fileList && fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
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
          <PersonalInfoFields
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
          <h3 className="text-lg font-medium mb-4 text-primary">Arbeitszeugnis</h3>
          <WorkReferenceFields
            workReference={workReference}
            setWorkReference={setWorkReference}
            workReferenceEvaluation={workReferenceEvaluation}
            setWorkReferenceEvaluation={setWorkReferenceEvaluation}
          />
        </div>

        {skills.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-primary">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Lebenslauf (Optional)</h3>
          <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
        </div>
      </div>
    </form>
  );
}