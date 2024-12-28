import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Building2, GraduationCap, Globe, Briefcase, Target, LineChart } from "lucide-react";
import { useCandidates } from "@/hooks/useCandidates";

export function AdvancedMetrics() {
  const { data: candidates } = useCandidates();

  // Calculate metrics from candidates data
  const sourceMetrics = candidates?.reduce((acc: Record<string, number>, candidate) => {
    const source = candidate.source || "Direct";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const metrics = [
    {
      title: "Source Breakdown",
      items: [
        { label: "LinkedIn", value: sourceMetrics?.["LinkedIn"] || 0, icon: <Users className="h-4 w-4 text-blue-600" /> },
        { label: "Direct", value: sourceMetrics?.["Direct"] || 0, icon: <UserPlus className="h-4 w-4 text-green-600" /> },
        { label: "Referral", value: sourceMetrics?.["Referral"] || 0, icon: <Building2 className="h-4 w-4 text-purple-600" /> }
      ]
    },
    {
      title: "Education Level",
      items: [
        { label: "Bachelor", value: candidates?.filter(c => c.education?.includes("Bachelor"))?.length || 0, icon: <GraduationCap className="h-4 w-4 text-orange-600" /> },
        { label: "Master", value: candidates?.filter(c => c.education?.includes("Master"))?.length || 0, icon: <GraduationCap className="h-4 w-4 text-red-600" /> },
        { label: "PhD", value: candidates?.filter(c => c.education?.includes("PhD"))?.length || 0, icon: <GraduationCap className="h-4 w-4 text-yellow-600" /> }
      ]
    },
    {
      title: "Location Distribution",
      items: [
        { label: "Local", value: candidates?.filter(c => c.location === "local")?.length || 0, icon: <Globe className="h-4 w-4 text-indigo-600" /> },
        { label: "Remote", value: candidates?.filter(c => c.location === "remote")?.length || 0, icon: <Globe className="h-4 w-4 text-pink-600" /> },
        { label: "Hybrid", value: candidates?.filter(c => c.location === "hybrid")?.length || 0, icon: <Globe className="h-4 w-4 text-cyan-600" /> }
      ]
    },
    {
      title: "Experience Level",
      items: [
        { label: "Junior", value: candidates?.filter(c => c.experience?.includes("Junior"))?.length || 0, icon: <Briefcase className="h-4 w-4 text-emerald-600" /> },
        { label: "Mid", value: candidates?.filter(c => c.experience?.includes("Mid"))?.length || 0, icon: <Briefcase className="h-4 w-4 text-violet-600" /> },
        { label: "Senior", value: candidates?.filter(c => c.experience?.includes("Senior"))?.length || 0, icon: <Briefcase className="h-4 w-4 text-amber-600" /> }
      ]
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
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
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