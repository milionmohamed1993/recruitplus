import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Globe, Mail, MapPin, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

export default function CompanyDetail() {
  const { id } = useParams();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Company not found");
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Lädt...</div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div>Firma nicht gefunden</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/companies">
                Firmen
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{company.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              {company.name}
            </h2>
            <p className="text-muted-foreground">
              Detaillierte Informationen über {company.name}
            </p>
          </div>
          <Button asChild>
            <Link to={`/companies/${company.id}/edit`}>Bearbeiten</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Firmeninformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              {company.industry && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Branche</div>
                  <div>{company.industry}</div>
                </div>
              )}
              {company.website && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </div>
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              {company.address && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </div>
                  <div>{company.address}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Kontaktinformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.contact_person && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Kontaktperson
                  </div>
                  <div>{company.contact_person}</div>
                </div>
              )}
              {company.contact_email && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail
                  </div>
                  <a 
                    href={`mailto:${company.contact_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.contact_email}
                  </a>
                </div>
              )}
              {company.contact_phone && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon
                  </div>
                  <a 
                    href={`tel:${company.contact_phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.contact_phone}
                  </a>
                </div>
              )}
              {company.notes && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Notizen
                  </div>
                  <div className="whitespace-pre-wrap">{company.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}