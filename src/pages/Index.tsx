import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BriefcaseIcon, Users, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Index() {
  // Mock data - in a real app, this would come from your backend
  const metrics = [
    { title: "Active Jobs", value: "12", icon: <BriefcaseIcon className="h-4 w-4 text-muted-foreground" /> },
    { title: "Total Candidates", value: "248", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
    { title: "Applications", value: "86", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
    { title: "Time to Hire (avg)", value: "18d", icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Senior Frontend Developer</div>
                    <div className="text-sm text-muted-foreground">4d ago</div>
                  </div>
                  <Progress value={65} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Product Manager</div>
                    <div className="text-sm text-muted-foreground">1w ago</div>
                  </div>
                  <Progress value={35} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">Applied for Senior Frontend Developer</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}