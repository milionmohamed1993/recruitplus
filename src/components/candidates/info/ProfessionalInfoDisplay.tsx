import { Building, Briefcase } from "lucide-react";
import { EditableField } from "./EditableField";
import { EditableSection } from "./EditableSection";
import type { Candidate } from "@/types/database.types";

interface ProfessionalInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function ProfessionalInfoDisplay({
  candidate,
  isEditing,
  editedCandidate,
  setEditedCandidate,
}: ProfessionalInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableSection title="Aktuelle Position">
        <EditableField
          label="Abteilung"
          value={editedCandidate.department || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, department: value })}
          icon={<Building className="h-4 w-4" />}
        />
        <EditableField
          label="Branche"
          value={editedCandidate.industry || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, industry: value })}
          icon={<Briefcase className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Erfahrung">
        <EditableField
          label="Berufserfahrung"
          value={editedCandidate.experience || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, experience: value })}
          icon={<Briefcase className="h-4 w-4" />}
        />
      </EditableSection>
    </div>
  );
}