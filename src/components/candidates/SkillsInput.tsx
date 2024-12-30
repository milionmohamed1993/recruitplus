import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Star, X } from "lucide-react";
import { useState } from "react";

interface SkillsInputProps {
  skills: { name: string; rating: number }[];
  setSkills: (skills: { name: string; rating: number }[]) => void;
}

export function SkillsInput({ skills, setSkills }: SkillsInputProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), rating: 3 }]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleRatingChange = (index: number, rating: number) => {
    const updatedSkills = [...skills];
    updatedSkills[index].rating = rating;
    setSkills(updatedSkills);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Neue Fähigkeit hinzufügen"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <Button type="button" onClick={handleAddSkill} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-accent/50 p-3 rounded-lg"
          >
            <span>{skill.name}</span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(index, rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        rating <= skill.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveSkill(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}