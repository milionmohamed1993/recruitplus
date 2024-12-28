import { Award, Star } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const renderSkillLevel = (index: number) => {
    const totalStars = 5;
    const level = Math.min(5, Math.max(1, Math.ceil((index + 1) * 5 / skills.length)));
    
    return (
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative pl-8 border-l-2 border-muted">
      <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
        <Award className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="space-y-4">
        <div className="font-medium">Fähigkeiten</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index}
              className="flex items-center justify-between bg-accent/50 p-3 rounded-lg"
            >
              <span>{skill}</span>
              {renderSkillLevel(index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}