import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  technical: Skill[];
  softSkills: Skill[];
  languages: Skill[];
}

interface SkillMatrixProps {
  candidateId: number;
  initialSkills: SkillCategory;
  onUpdate: (skills: SkillCategory) => void;
}

export function SkillMatrix({ candidateId, initialSkills, onUpdate }: SkillMatrixProps) {
  const [skills, setSkills] = useState<SkillCategory>(initialSkills);
  const { toast } = useToast();

  const handleRatingChange = (category: keyof SkillCategory, index: number, newRating: number) => {
    const updatedSkills = { ...skills };
    updatedSkills[category][index].level = newRating;
    setSkills(updatedSkills);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('skill_assessments')
        .upsert(
          Object.entries(skills).flatMap(([category, skillList]) =>
            skillList.map(skill => ({
              candidate_id: candidateId,
              category,
              skill_name: skill.name,
              rating: skill.level,
            }))
          )
        );

      if (error) throw error;

      onUpdate(skills);
      toast({
        title: "Skills gespeichert",
        description: "Die Skill-Matrix wurde erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: "Fehler",
        description: "Die Skills konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const renderSkillCategory = (category: keyof SkillCategory, title: string) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="grid gap-4">
        {skills[category].map((skill, index) => (
          <div key={skill.name} className="flex items-center justify-between bg-accent/50 p-3 rounded-lg">
            <span>{skill.name}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(category, index, rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-4 w-4 ${
                      rating <= skill.level
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill-Matrix</CardTitle>
        <Button onClick={handleSave}>Speichern</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderSkillCategory("technical", "Technische Fähigkeiten")}
        {renderSkillCategory("softSkills", "Soft Skills")}
        {renderSkillCategory("languages", "Sprachen")}
      </CardContent>
    </Card>
  );
}