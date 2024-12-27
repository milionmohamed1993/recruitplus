import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar } from "lucide-react";

// Temporary mock data until we integrate with backend
const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    applicants: 12,
    postedDate: "2024-02-20",
    description: "We're looking for an experienced Frontend Developer to join our team...",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "New York, NY",
    type: "Full-time",
    applicants: 8,
    postedDate: "2024-02-19",
    description: "Seeking a Product Manager to lead our product development initiatives...",
  },
];

export function JobList() {
  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <Card key={job.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription className="mt-1">{job.company}</CardDescription>
              </div>
              <Badge>{job.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job.applicants} applicants
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}