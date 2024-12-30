import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Geschlecht auswählen" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Herr</SelectItem>
        <SelectItem value="female">Frau</SelectItem>
        <SelectItem value="other">Andere</SelectItem>
      </SelectContent>
    </Select>
  );
}