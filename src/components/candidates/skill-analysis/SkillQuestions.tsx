import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  category: string;
  question: string;
  skillReference: string;
}

interface SkillQuestionsProps {
  questions: Question[];
}

export function SkillQuestions({ questions }: SkillQuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview-Fragen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-accent/50 space-y-2"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline">{question.category}</Badge>
                <Badge variant="secondary">{question.skillReference}</Badge>
              </div>
              <p className="text-sm">{question.question}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}