interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4 text-primary">{title}</h3>
      {children}
    </div>
  );
}