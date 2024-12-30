import { Mail, Briefcase, UserCheck } from "lucide-react";
import { EditableField } from "./EditableField";
import { EditableSection } from "./EditableSection";
import { Badge } from "@/components/ui/badge";
import { GenderSelect } from "../GenderSelect";
import type { Candidate } from "@/types/database.types";

interface BasicInfoSectionProps {
  candidate: Candidate;
  isEditing: boolean;
  editedCandidate: Candidate;
  setEditedCandidate: (candidate: Candidate) => void;
}

export function BasicInfoSection({
  candidate,
  isEditing,
  editedCandidate,
  setEditedCandidate,
}: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EditableSection title="Kontakt & Position">
        <EditableField
          label="Email"
          value={editedCandidate.email}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, email: value })}
          icon={<Mail className="h-4 w-4" />}
        />
        <EditableField
          label="Position"
          value={editedCandidate.position || ""}
          isEditing={isEditing}
          onChange={(value) => setEditedCandidate({ ...editedCandidate, position: value })}
          icon={<Briefcase className="h-4 w-4" />}
        />
      </EditableSection>

      <EditableSection title="Status">
        <div className="flex items-center gap-3">
          <UserCheck className="h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Geschlecht</div>
            {isEditing ? (
              <GenderSelect
                value={editedCandidate.gender || "other"}
                onChange={(value) =>
                  setEditedCandidate({ ...editedCandidate, gender: value })
                }
              />
            ) : (
              <div className="text-sm text-muted-foreground">
                {candidate.gender === "male"
                  ? "Herr"
                  : candidate.gender === "female"
                  ? "Frau"
                  : "Andere"}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserCheck className="h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-medium">Status</div>
            <Badge variant="secondary">{candidate.status}</Badge>
          </div>
        </div>
      </EditableSection>
    </div>
  );
}