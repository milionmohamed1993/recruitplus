import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { format } from "date-fns"

export function JobList() {
  const { data: jobs, isLoading, error } = useJobs()

  if (isLoading) {
    return <div>Loading jobs...</div>
  }

  if (error) {
    return <div>Error loading jobs: {error.message}</div>
  }

  return (
    <div className="grid gap-4">
      {jobs?.map((job) => (
        <Card key={job.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription className="mt-1">Company Name</CardDescription>
              </div>
              <Badge>Full-time</Badge>
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
                  {job.location || 'Remote'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  0 applicants
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {format(new Date(job.created_at), 'PP')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}