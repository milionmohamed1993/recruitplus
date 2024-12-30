import { Input } from "@/components/ui/input";
import { EducationLevelSelect } from "./EducationLevelSelect";

interface ProfessionalInfoFieldsProps {
  position: string;
  setPosition: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  education: string;
  setEducation: (value: string) => void;
  university: string;
  setUniversity: (value: string) => void;
}

export function ProfessionalInfoFields({
  position,
  setPosition,
  company,
  setCompany,
  department,
  setDepartment,
  industry,
  setIndustry,
  experience,
  setExperience,
  education,
  setEducation,
  university,
  setUniversity,
}: ProfessionalInfoFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-2">Position</label>
        <Input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="z.B. Software Engineer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Unternehmen</label>
        <Input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Aktuelles Unternehmen"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Abteilung</label>
        <Input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="z.B. Engineering"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Branche</label>
        <Input
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="z.B. Technologie"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Berufserfahrung</label>
        <Input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="z.B. 5 Jahre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Höchste Ausbildung</label>
        <EducationLevelSelect value={education} onChange={setEducation} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Universität/Institution</label>
        <Input
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="Name der Institution"
        />
      </div>
    </div>
  );
}