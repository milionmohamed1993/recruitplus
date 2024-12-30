import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export function EditableField({
  label,
  value,
  isEditing,
  onChange,
  icon,
  className = "",
  placeholder,
}: EditableFieldProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && <div className="text-primary">{icon}</div>}
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        {isEditing ? (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1"
            placeholder={placeholder}
          />
        ) : (
          <div className="text-sm text-muted-foreground">
            {value || "Nicht angegeben"}
          </div>
        )}
      </div>
    </div>
  );
}