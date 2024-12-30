import { Building, Briefcase, Clock, Coins, FileText } from "lucide-react";
import { EditableField } from "./EditableField";
import { EditableSection } from "./EditableSection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const workModels = [
    { value: "onsite", label: "Vor Ort" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

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
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Bevorzugtes Arbeitsmodell</label>
              <Select
                value={editedCandidate.preferred_work_model || ""}
                onValueChange={(value) =>
                  setEditedCandidate({ ...editedCandidate, preferred_work_model: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Arbeitsmodell auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {workModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex-1">
              <div className="text-sm font-medium">Bevorzugtes Arbeitsmodell</div>
              <div className="text-sm text-muted-foreground">
                {workModels.find((model) => model.value === editedCandidate.preferred_work_model)?.label || "Nicht angegeben"}
              </div>
            </div>
          )}
        </div>
      </EditableSection>

      <EditableSection title="Gehaltsvorstellungen">
        <EditableField
          label="Gehaltsvorstellung (CHF)"
          value={editedCandidate.salary_expectation || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, salary_expectation: value })}
          icon={<Coins className="h-4 w-4" />}
          placeholder="z.B. 120'000"
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