import { Input } from "@/components/ui/input";
import { CandidateFormData } from "./types/CandidateFormTypes";

interface PersonalInfoFieldsProps {
  formData: CandidateFormData;
  setFormData: React.Dispatch<React.SetStateAction<CandidateFormData>>;
}

export function PersonalInfoFields({
  formData,
  setFormData,
}: PersonalInfoFieldsProps) {
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
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          required
          value={formData.name}
          onChange={handleChange("name")}
          placeholder="Max Mustermann"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">E-Mail</label>
        <Input
          required
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          placeholder="max@beispiel.de"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Telefon</label>
        <Input
          value={formData.phone}
          onChange={handleChange("phone")}
          placeholder="+49 123 456789"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Geburtsdatum</label>
        <Input
          type="date"
          value={formData.birthdate}
          onChange={handleChange("birthdate")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Adresse</label>
        <Input
          value={formData.address}
          onChange={handleChange("address")}
          placeholder="Straße, PLZ, Stadt"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Nationalität</label>
        <Input
          value={formData.nationality}
          onChange={handleChange("nationality")}
          placeholder="z.B. Deutsch"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Standort</label>
        <Input
          value={formData.location}
          onChange={handleChange("location")}
          placeholder="z.B. Berlin"
        />
      </div>
    </div>
  );
}