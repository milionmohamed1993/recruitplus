import { Card } from "@/components/ui/card";

interface EditableSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function EditableSection({ title, children, className = "" }: EditableSectionProps) {
  return (
    <div className={`space-y-4 bg-accent/20 p-4 rounded-lg ${className}`}>
      <h3 className="font-medium text-sm text-muted-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}