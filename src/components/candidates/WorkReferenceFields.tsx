import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WorkReferenceFieldsProps {
  workReference: string;
  setWorkReference: (value: string) => void;
  workReferenceEvaluation: string;
  setWorkReferenceEvaluation: (value: string) => void;
}

export function WorkReferenceFields({
  workReference,
  setWorkReference,
  workReferenceEvaluation,
  setWorkReferenceEvaluation,
}: WorkReferenceFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Arbeitszeugnis (Optional)</label>
        <Textarea
          value={workReference}
          onChange={(e) => setWorkReference(e.target.value)}
          placeholder="Fügen Sie hier den Text des Arbeitszeugnisses ein..."
          className="h-32"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2">Einschätzung des Arbeitszeugnisses</label>
        <Textarea
          value={workReferenceEvaluation}
          onChange={(e) => setWorkReferenceEvaluation(e.target.value)}
          placeholder="Automatische Einschätzung des Arbeitszeugnisses..."
          className="h-32"
          readOnly
        />
      </div>
    </div>
  );
}