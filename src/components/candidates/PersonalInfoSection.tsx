import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenderSelect } from "./GenderSelect";
import { SourceSelect } from "./SourceSelect";

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
  source: string;
  setSource: (value: string) => void;
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
  source,
  setSource,
}: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Name eingeben"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-Mail eingeben"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input
          id="phone"
          placeholder="Telefonnummer eingeben"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthdate">Geburtsdatum</Label>
        <Input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          placeholder="Adresse eingeben"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">Nationalität</Label>
        <Input
          id="nationality"
          placeholder="Nationalität eingeben"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Standort</Label>
        <Input
          id="location"
          placeholder="Standort eingeben"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Geschlecht</Label>
        <GenderSelect value={gender} onChange={setGender} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Quelle</Label>
        <SourceSelect value={source} onChange={setSource} />
      </div>
    </div>
  );
}