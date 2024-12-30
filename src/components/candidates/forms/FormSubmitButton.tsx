import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function FormSubmitButton() {
  return (
    <Button 
      type="submit" 
      form="add-candidate-form"
      size="lg"
      variant="default"
      className="flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all text-black"
    >
      <UserPlus className="h-5 w-5" />
      Kandidat erstellen
    </Button>
  );
}