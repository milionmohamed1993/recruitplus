import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { ResumeUpload } from "./ResumeUpload";
import { CandidateFormData } from "./types/CandidateFormTypes";
import { handleCandidateSubmission } from "./utils/candidateSubmission";

export function AddCandidateForm() {
  const [formData, setFormData] = useState<CandidateFormData>({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    nationality: "",
    location: "",
    // Professional Information
    position: "",
    company: "",
    department: "",
    industry: "",
    experience: "",
    education: "",
    university: "",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResumeAnalyzed = (data: any) => {
    if (data.personalInfo) {
      setFormData(prev => ({
        ...prev,
        name: data.personalInfo.name || prev.name,
        email: data.personalInfo.email || prev.email,
        phone: data.personalInfo.phone || prev.phone,
        birthdate: data.personalInfo.birthdate ? formatBirthdate(data.personalInfo.birthdate) : prev.birthdate,
        address: data.personalInfo.address || prev.address,
        nationality: data.personalInfo.nationality || prev.nationality,
        location: data.personalInfo.location || prev.location,
      }));
    }

    if (data.professionalInfo) {
      setFormData(prev => ({
        ...prev,
        position: data.professionalInfo.position || prev.position,
        company: data.professionalInfo.company || prev.company,
        department: data.professionalInfo.department || prev.department,
        industry: data.professionalInfo.industry || prev.industry,
        experience: data.professionalInfo.experience || prev.experience,
      }));
    }

    if (data.education) {
      setFormData(prev => ({
        ...prev,
        education: data.education.degree || prev.education,
        university: data.education.university || prev.university,
      }));
    }

    toast({
      title: "Lebenslauf analysiert",
      description: "Die Informationen wurden erfolgreich extrahiert.",
    });
  };

  const formatBirthdate = (date: string) => {
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
      return "";
    } catch (e) {
      console.log("Could not parse birthdate:", e);
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await handleCandidateSubmission(formData, document.querySelector<HTMLInputElement>('#resume-upload')?.files);
      
      if (result.success) {
        toast({
          title: "Kandidat hinzugefügt",
          description: "Der Kandidat wurde erfolgreich hinzugefügt.",
        });
        navigate("/candidates");
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
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
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 text-primary">Berufliche Informationen</h3>
          <ProfessionalInfoFields
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div className="hidden">
          <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
        </div>
      </div>
    </form>
  );
}