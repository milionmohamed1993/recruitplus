import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { ResumeUpload } from "./ResumeUpload";

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

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResumeAnalyzed = (data: any) => {
    // Update form fields with parsed data
    if (data.personalInfo) {
      setName(data.personalInfo.name || "");
      setEmail(data.personalInfo.email || "");
      setPhone(data.personalInfo.phone || "");
      setBirthdate(data.personalInfo.birthdate || "");
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

    toast({
      title: "Lebenslauf analysiert",
      description: "Die Informationen wurden erfolgreich extrahiert.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("candidates")
        .insert([
          {
            name,
            email,
            phone,
            position,
            birthdate,
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
          },
        ]);

      if (error) throw error;

      toast({
        title: "Kandidat hinzugefügt",
        description: "Der Kandidat wurde erfolgreich hinzugefügt.",
      });
      navigate("/candidates");
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Hinzufügen des Kandidaten ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Persönliche Informationen</h3>
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
          <h3 className="text-lg font-medium mb-4">Berufliche Informationen</h3>
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
          <h3 className="text-lg font-medium mb-4">Lebenslauf (Optional)</h3>
          <ResumeUpload onResumeAnalyzed={handleResumeAnalyzed} />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Kandidat hinzufügen
      </Button>
    </form>
  );
}