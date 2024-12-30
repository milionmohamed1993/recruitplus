import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { noteCategories } from "./noteCategories";

interface NoteFormProps {
  onSubmit: (category: string, answers: Record<string, string>) => void;
  onCancel: () => void;
}

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;
    onSubmit(selectedCategory, answers);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Kategorie</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(noteCategories).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {selectedCategory && (
        <div className="space-y-4">
          {noteCategories[selectedCategory as keyof typeof noteCategories].questions.map(
            (question, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium">{question}</label>
                <Textarea
                  placeholder="Ihre Antwort..."
                  value={answers[question] || ""}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )
          )}
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedCategory || Object.keys(answers).length === 0}
        >
          Notiz hinzufügen
        </Button>
      </DialogFooter>
    </div>
  );
}