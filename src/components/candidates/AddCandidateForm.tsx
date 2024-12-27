import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";

export function AddCandidateForm() {
  const [resume, setResume] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      try {
        if (selectedFile.type === 'application/pdf') {
          toast({
            title: "PDF-Verarbeitung",
            description: "PDF-Dateien werden derzeit noch nicht unterstützt. Bitte kopieren Sie den Inhalt manuell in das Textfeld.",
          });
          return;
        }
        const text = await selectedFile.text();
        setResume(text);
        toast({
          title: "Lebenslauf hochgeladen",
          description: "Der Lebenslauf wurde erfolgreich hochgeladen.",
        });
      } catch (error) {
        toast({
          title: "Fehler",
          description: "Beim Hochladen des Lebenslaufs ist ein Fehler aufgetreten.",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Extract work experience, education, and skills from this resume.",
            },
            {
              role: "user",
              content: resume,
            },
          ],
        }),
      });

      const data = await response.json();
      toast({
        title: "Lebenslauf analysiert",
        description: "Die Informationen wurden erfolgreich extrahiert.",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Fehler",
        description: "Beim Analysieren des Lebenslaufs ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
                onClick={() => document.getElementById('resume-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Lebenslauf hochladen
              </Button>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".txt,.doc,.docx"
                onChange={handleFileChange}
              />
              {file && (
                <span className="text-sm text-muted-foreground">
                  {file.name}
                </span>
              )}
            </div>
            <Textarea
              placeholder="Fügen Sie hier den Lebenslauf ein..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="h-64"
            />
          </div>
        </div>

        {resume && (
          <Button
            type="button"
            onClick={analyzeResume}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analysiere..." : "Lebenslauf analysieren"}
          </Button>
        )}
      </div>

      <Button type="submit" className="w-full">
        Kandidat hinzufügen
      </Button>
    </form>
  );
}