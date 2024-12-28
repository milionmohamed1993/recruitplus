import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecruitmentFunnel } from "@/components/dashboard/RecruitmentFunnel";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { UpcomingInterviews } from "@/components/dashboard/UpcomingInterviews";
import { AdvancedMetrics } from "@/components/dashboard/AdvancedMetrics";
import { BriefcaseIcon, Users, FileText, Clock, Brain, Target, Zap } from "lucide-react";

export default function Index() {
  const metrics = [
    { 
      title: "Aktive Stellen", 
      value: "12", 
      icon: <BriefcaseIcon className="h-4 w-4 text-blue-600" />,
      description: "4 neue diesen Monat"
    },
    { 
      title: "Kandidaten Gesamt", 
      value: "248", 
      icon: <Users className="h-4 w-4 text-green-600" />,
      description: "+18% zum Vormonat"
    },
    { 
      title: "KI-Analysen", 
      value: "186", 
      icon: <Brain className="h-4 w-4 text-purple-600" />,
      description: "94% Erfolgsrate"
    },
    { 
      title: "Zeit bis Einstellung", 
      value: "18T", 
      icon: <Clock className="h-4 w-4 text-orange-600" />,
      description: "-3 Tage zum Durchschnitt"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Willkommen zurück</h1>
          <p className="text-muted-foreground">
            Hier ist ein Überblick über Ihre Recruiting-Pipeline und aktuelle Aktivitäten.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              description={metric.description}
            />
          ))}
        </div>

        <AdvancedMetrics />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <RecruitmentFunnel />
          <RecentActivities />
          <UpcomingInterviews />
        </div>
      </div>
    </DashboardLayout>
  );
}