import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Building2, GraduationCap, Globe, Briefcase } from "lucide-react";
import { useCandidates } from "@/hooks/useCandidates";
import type { Candidate } from "@/types/database.types";

const RELEVANT_EDUCATION_LEVELS = [
  "Fachausweis",
  "HFP",
  "HF",
  "Bachelor",
  "Master",
  "PhD"
];

export function AdvancedMetrics() {
  const { data: candidates } = useCandidates();

  // Calculate metrics from candidate data
  const sourceMetrics = candidates?.reduce((acc: Record<string, number>, candidate: Candidate) => {
    const source = candidate.source || "Direkt";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const educationMetrics = candidates?.reduce((acc: Record<string, number>, candidate: Candidate) => {
    const education = candidate.education || "Nicht angegeben";
    // Only count if it's one of our relevant education levels
    if (RELEVANT_EDUCATION_LEVELS.some(level => education.includes(level))) {
      acc[education] = (acc[education] || 0) + 1;
    }
    return acc;
  }, {});

  // Sort education metrics by count and get top 5
  const topEducation = Object.entries(educationMetrics || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([education, count]) => ({
      label: education,
      value: count,
      icon: <GraduationCap className="h-4 w-4 text-orange-600" />
    }));

  const locationMetrics = candidates?.reduce((acc: Record<string, number>, candidate: Candidate) => {
    const location = candidate.location || "Nicht angegeben";
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const industryMetrics = candidates?.reduce((acc: Record<string, number>, candidate: Candidate) => {
    const industry = candidate.industry || "Nicht angegeben";
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});

  const metrics = [
    {
      title: "Quellen-Übersicht",
      items: [
        { label: "LinkedIn", value: sourceMetrics?.["LinkedIn"] || 0, icon: <Users className="h-4 w-4 text-blue-600" /> },
        { label: "Direkt", value: sourceMetrics?.["Direkt"] || 0, icon: <UserPlus className="h-4 w-4 text-green-600" /> },
        { label: "Empfehlung", value: sourceMetrics?.["Empfehlung"] || 0, icon: <Building2 className="h-4 w-4 text-purple-600" /> }
      ]
    },
    {
      title: "Top 5 Ausbildungsniveau",
      items: topEducation
    },
    {
      title: "Standort-Verteilung",
      items: [
        { 
          label: "Vor Ort", 
          value: candidates?.filter(c => c.preferred_work_model === "onsite").length || 0, 
          icon: <Globe className="h-4 w-4 text-indigo-600" /> 
        },
        { 
          label: "Remote", 
          value: candidates?.filter(c => c.preferred_work_model === "remote").length || 0, 
          icon: <Globe className="h-4 w-4 text-pink-600" /> 
        },
        { 
          label: "Hybrid", 
          value: candidates?.filter(c => c.preferred_work_model === "hybrid").length || 0, 
          icon: <Globe className="h-4 w-4 text-cyan-600" /> 
        }
      ]
    },
    {
      title: "Top Branchen",
      items: Object.entries(industryMetrics || {})
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([industry, count]) => ({
          label: industry,
          value: count,
          icon: <Briefcase className="h-4 w-4 text-emerald-600" />
        }))
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <div key={item.label + index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}