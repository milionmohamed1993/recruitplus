import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobList } from "@/components/jobs/JobList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Jobs() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <p className="text-muted-foreground">Manage and post new job openings</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Post New Job
        </Button>
      </div>
      <JobList />
    </DashboardLayout>
  );
}