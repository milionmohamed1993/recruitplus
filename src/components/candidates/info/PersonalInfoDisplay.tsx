import { Calendar, Flag, Globe, Mail, MapPin, Phone } from "lucide-react";
import { EditableField } from "./EditableField";
import { EditableSection } from "./EditableSection";
import type { Candidate } from "@/types/database.types";
import { format } from "date-fns";

interface PersonalInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function PersonalInfoDisplay({
  candidate,
  isEditing,
  editedCandidate,
  setEditedCandidate,
}: PersonalInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <EditableSection title="Kontakt">
        <EditableField
          label="E-Mail"
          value={editedCandidate.email}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, email: value })}
          icon={<Mail className="h-4 w-4" />}
        />
        <EditableField
          label="Telefon"
          value={editedCandidate.phone || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, phone: value })}
          icon={<Phone className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Persönlich">
        <EditableField
          label="Geburtsdatum"
          value={editedCandidate.birthdate ? format(new Date(editedCandidate.birthdate), "dd.MM.yyyy") : ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, birthdate: value })}
          icon={<Calendar className="h-4 w-4" />}
        />
        <EditableField
          label="Nationalität"
          value={editedCandidate.nationality || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, nationality: value })}
          icon={<Flag className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Standort" className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditableField
            label="Adresse"
            value={editedCandidate.address || ""}
            isEditing={isEditing}
            onChange={(value) => setEditedCandidate({ ...editedCandidate, address: value })}
            icon={<MapPin className="h-4 w-4" />}
          />
          <EditableField
            label="Standort"
            value={editedCandidate.location || ""}
            isEditing={isEditing}
            onChange={(value) => setEditedCandidate({ ...editedCandidate, location: value })}
            icon={<Globe className="h-4 w-4" />}
          />
        </div>
      </EditableSection>
    </div>
  );
}