import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCompanyForm } from "@/components/companies/AddCompanyForm";
import { Building2 } from "lucide-react";

export default function AddCompany() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Neue Firma hinzufügen</h1>
        </div>
        <AddCompanyForm />
      </div>
    </DashboardLayout>
  );
}