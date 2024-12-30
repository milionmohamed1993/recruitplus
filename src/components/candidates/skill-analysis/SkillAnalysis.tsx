import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { SkillMatrix } from "./SkillMatrix";
import { SkillQuestions } from "./SkillQuestions";
import type { Candidate } from "@/types/database.types";

interface SkillAnalysisProps {
  candidate: Candidate;
}

export function SkillAnalysis({ candidate }: SkillAnalysisProps) {
  const [skillAnalysis, setSkillAnalysis] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSkillAnalysis = async () => {
      try {
        // First check if we already have an analysis
        const { data: attachments } = await supabase
          .from("candidate_attachments")
          .select("skill_analysis")
          .eq("candidate_id", candidate.id)
          .eq("category", "resume")
          .order("created_at", { ascending: false })
          .limit(1);

        if (attachments?.[0]?.skill_analysis) {
          setSkillAnalysis(attachments[0].skill_analysis);
          return;
        }

        // If not, get the latest resume
        const { data: resumes } = await supabase
          .from("candidate_attachments")
          .select("*")
          .eq("candidate_id", candidate.id)
          .eq("category", "resume")
          .order("created_at", { ascending: false })
          .limit(1);

        if (!resumes?.length) {
          toast({
            title: "Kein Lebenslauf gefunden",
            description: "Bitte laden Sie zuerst einen Lebenslauf hoch.",
            variant: "destructive",
          });
          return;
        }

        // Get the resume content
        const { data: resumeUrl } = await supabase.storage
          .from("attachments")
          .createSignedUrl(resumes[0].file_path, 3600);

        if (!resumeUrl?.signedUrl) {
          throw new Error("Could not access resume file");
        }

        const response = await fetch(resumeUrl.signedUrl);
        const text = await response.text();

        // Analyze the resume
        const { data: analysis, error } = await supabase.functions.invoke("analyze-skills", {
          body: { resumeText: text },
        });

        if (error) throw error;

        // Save the analysis
        const { error: updateError } = await supabase
          .from("candidate_attachments")
          .update({ skill_analysis: analysis })
          .eq("id", resumes[0].id);

        if (updateError) throw updateError;

        setSkillAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing skills:", error);
        toast({
          title: "Fehler",
          description: "Die Skill-Analyse konnte nicht durchgeführt werden.",
          variant: "destructive",
        });
      }
    };

    fetchSkillAnalysis();
  }, [candidate.id]);

  if (!skillAnalysis) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Analysiere Fähigkeiten...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SkillMatrix
        candidateId={candidate.id}
        initialSkills={skillAnalysis.skillCategories}
        onUpdate={(skills) => {
          setSkillAnalysis({
            ...skillAnalysis,
            skillCategories: skills,
          });
        }}
      />
      <SkillQuestions questions={skillAnalysis.questions} />
    </div>
  );
}