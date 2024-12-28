import { Input } from "@/components/ui/input";
import { CandidateFormData } from "./types/CandidateFormTypes";

interface ProfessionalInfoFieldsProps {
  formData: CandidateFormData;
  setFormData: React.Dispatch<React.SetStateAction<CandidateFormData>>;
}

export function ProfessionalInfoFields({
  formData,
  setFormData,
}: ProfessionalInfoFieldsProps) {
  const handleChange = (field: keyof CandidateFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-2">Position</label>
        <Input
          required
          value={formData.position}
          onChange={handleChange("position")}
          placeholder="z.B. Software Entwickler"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Firma</label>
        <Input
          value={formData.company}
          onChange={handleChange("company")}
          placeholder="Aktueller Arbeitgeber"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Abteilung</label>
        <Input
          value={formData.department}
          onChange={handleChange("department")}
          placeholder="z.B. IT"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Branche</label>
        <Input
          value={formData.industry}
          onChange={handleChange("industry")}
          placeholder="z.B. Technologie"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Berufserfahrung</label>
        <Input
          value={formData.experience}
          onChange={handleChange("experience")}
          placeholder="z.B. 5 Jahre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Ausbildung</label>
        <Input
          value={formData.education}
          onChange={handleChange("education")}
          placeholder="z.B. Master"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Universität</label>
        <Input
          value={formData.university}
          onChange={handleChange("university")}
          placeholder="Name der Universität"
        />
      </div>
    </div>
  );
}