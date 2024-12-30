import { Building, Briefcase, Clock, Coins, FileText } from "lucide-react";
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
          label="Position"
          value={editedCandidate.position || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, position: value })}
          icon={<Briefcase className="h-4 w-4" />}
        />
        <EditableField
          label="Firma"
          value={editedCandidate.company || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, company: value })}
          icon={<Building className="h-4 w-4" />}
        />
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
        <EditableField
          label="Projekterfahrung"
          value={editedCandidate.project_experience || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, project_experience: value })}
          icon={<FileText className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Verfügbarkeit & Konditionen">
        <EditableField
          label="Kündigungsfrist"
          value={editedCandidate.notice_period || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, notice_period: value })}
          icon={<Clock className="h-4 w-4" />}
        />
        <EditableField
          label="Bevorzugtes Arbeitsmodell"
          value={editedCandidate.preferred_work_model || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, preferred_work_model: value })}
          icon={<Building className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Gehaltsvorstellungen">
        <EditableField
          label="Gehaltsvorstellung"
          value={editedCandidate.salary_expectation || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, salary_expectation: value })}
          icon={<Coins className="h-4 w-4" />}
        />
        <EditableField
          label="Gehaltsflexibilität"
          value={editedCandidate.salary_flexibility || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, salary_flexibility: value })}
          icon={<Coins className="h-4 w-4" />}
        />
      </EditableSection>
    </div>
  );
}