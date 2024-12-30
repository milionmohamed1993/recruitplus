import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Star, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

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
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1.5"
          >
            <span>{skill.name}</span>
            <div className="flex items-center gap-1 ml-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(index, rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-3 w-3 ${
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
              size="sm"
              onClick={() => handleRemoveSkill(index)}
              className="h-5 w-5 p-0 ml-1 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}