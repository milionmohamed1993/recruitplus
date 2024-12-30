import { GraduationCap, School } from "lucide-react";
import { EditableField } from "./EditableField";
import { EditableSection } from "./EditableSection";
import type { Candidate } from "@/types/database.types";

interface EducationInfoDisplayProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function EducationInfoDisplay({
  candidate,
  isEditing,
  editedCandidate,
  setEditedCandidate,
}: EducationInfoDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableSection title="Bildungsweg">
        <EditableField
          label="Ausbildung"
          value={editedCandidate.education || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, education: value })}
          icon={<GraduationCap className="h-4 w-4" />}
        />
        <EditableField
          label="Universität"
          value={editedCandidate.university || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, university: value })}
          icon={<School className="h-4 w-4" />}
        />
      </EditableSection>
    </div>
  );
}