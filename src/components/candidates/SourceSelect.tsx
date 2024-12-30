import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SourceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SourceSelect({ value, onChange }: SourceSelectProps) {
  const sources = [
    { value: "Direct", label: "Direkt" },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "Referral", label: "Empfehlung" },
    { value: "Website", label: "Website" },
    { value: "Job Board", label: "Jobbörse" },
    { value: "Other", label: "Andere" },
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Quelle auswählen" />
      </SelectTrigger>
      <SelectContent>
        {sources.map((source) => (
          <SelectItem key={source.value} value={source.value}>
            {source.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}