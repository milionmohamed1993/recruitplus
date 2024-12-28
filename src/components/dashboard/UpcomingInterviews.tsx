import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Users } from "lucide-react";

const interviews = [
  {
    candidate: "Emma Wilson",
    position: "Full Stack Developer",
    time: "Today at 2:00 PM",
    type: "Technical Interview",
  },
  {
    candidate: "Michael Brown",
    position: "DevOps Engineer",
    time: "Today at 4:30 PM",
    type: "Initial Screening",
  },
  {
    candidate: "Sophie Taylor",
    position: "Product Manager",
    time: "Tomorrow at 10:00 AM",
    type: "Final Interview",
  },
];

export function UpcomingInterviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Interviews</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {interviews.map((interview, i) => (
              <div
                key={i}
                className="flex flex-col space-y-2 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">{interview.candidate}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {interview.time}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {interview.position}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-1 h-4 w-4 text-primary" />
                  {interview.type}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}