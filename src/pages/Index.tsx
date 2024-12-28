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
      title: "Active Jobs", 
      value: "12", 
      icon: <BriefcaseIcon className="h-4 w-4 text-blue-600" />,
      description: "4 new this month"
    },
    { 
      title: "Total Candidates", 
      value: "248", 
      icon: <Users className="h-4 w-4 text-green-600" />,
      description: "+18% from last month"
    },
    { 
      title: "AI Analyses", 
      value: "186", 
      icon: <Brain className="h-4 w-4 text-purple-600" />,
      description: "94% success rate"
    },
    { 
      title: "Time to Hire", 
      value: "18d", 
      icon: <Clock className="h-4 w-4 text-orange-600" />,
      description: "-3 days from average"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Here's an overview of your recruitment pipeline and recent activities.
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