import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, FileText, Calendar, MessageSquare } from "lucide-react";

const activities = [
  {
    icon: <UserPlus className="h-4 w-4" />,
    title: "New Candidate",
    description: "John Doe applied for Senior Frontend Developer",
    time: "5 minutes ago",
  },
  {
    icon: <FileText className="h-4 w-4" />,
    title: "Resume Analyzed",
    description: "AI completed analysis of Sarah Smith's resume",
    time: "10 minutes ago",
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    title: "Interview Scheduled",
    description: "Technical interview with Mike Johnson",
    time: "1 hour ago",
  },
  {
    icon: <MessageSquare className="h-4 w-4" />,
    title: "Feedback Received",
    description: "Positive feedback from technical interview",
    time: "2 hours ago",
  },
];

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  {activity.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}