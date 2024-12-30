import { Input } from "@/components/ui/input";
import { GenderSelect } from "./GenderSelect";

interface PersonalInfoSectionProps {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  birthdate: string;
  setBirthdate: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  nationality: string;
  setNationality: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
}

export function PersonalInfoSection({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  birthdate,
  setBirthdate,
  address,
  setAddress,
  nationality,
  setNationality,
  location,
  setLocation,
  gender,
  setGender,
}: PersonalInfoSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Max Mustermann"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">E-Mail</label>
        <Input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="max@beispiel.de"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Telefon</label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+49 123 456789"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Geburtsdatum</label>
        <Input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Adresse</label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Straße, PLZ, Stadt"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Nationalität</label>
        <Input
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="z.B. Deutsch"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Standort</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="z.B. Berlin"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Geschlecht</label>
        <GenderSelect value={gender} onChange={setGender} />
      </div>
    </div>
  );
}