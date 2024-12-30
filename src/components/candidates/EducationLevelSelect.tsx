import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const educationLevels = [
  { value: "EBA", label: "Eidgenössisches Berufsattest (EBA)" },
  { value: "EFZ", label: "Eidgenössisches Fähigkeitszeugnis (EFZ)" },
  { value: "Berufsmaturität", label: "Berufsmaturität" },
  { value: "Fachausweis", label: "Fachausweis (Berufsprüfung)" },
  { value: "HFP", label: "Diplom einer Höheren Fachprüfung (HFP)" },
  { value: "HF", label: "Höhere Fachschule (HF)" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "PhD", label: "PhD (Doktorat)" },
  { value: "CAS", label: "CAS (Certificate of Advanced Studies)" },
  { value: "DAS", label: "DAS (Diploma of Advanced Studies)" },
  { value: "MAS", label: "MAS (Master of Advanced Studies)" },
  { value: "Gymnasiale_Matura", label: "Gymnasiale Matura" },
  { value: "Berufsmaturität_Plus", label: "Berufsmaturität Plus" },
  { value: "Branchenzertifikate", label: "Spezifische Branchenzertifikate" },
  { value: "Kein_Abschluss", label: "Kein Abschluss" },
];

interface EducationLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function EducationLevelSelect({ value, onChange }: EducationLevelSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Höchste Ausbildung auswählen" />
      </SelectTrigger>
      <SelectContent>
        {educationLevels.map((level) => (
          <SelectItem key={level.value} value={level.value}>
            {level.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { educationLevels };