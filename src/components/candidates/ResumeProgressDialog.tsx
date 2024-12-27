import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ResumeProgressDialogProps {
  isOpen: boolean;
  progress: number;
  status: string;
}

export function ResumeProgressDialog({ isOpen, progress, status }: ResumeProgressDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lebenslauf wird verarbeitet</DialogTitle>
          <DialogDescription>{status}</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Progress value={progress} className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}