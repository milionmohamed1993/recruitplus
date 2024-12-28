import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Globe, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function CompaniesList() {
  const { data: companies, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Branche</TableHead>
            <TableHead>Kontaktperson</TableHead>
            <TableHead>Kontakt</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <Link 
                  to={`/companies/${company.id}`}
                  className="flex items-center gap-2 hover:text-blue-600"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{company.name}</span>
                </Link>
              </TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>{company.contact_person}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600">
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                  {company.contact_email && (
                    <a href={`mailto:${company.contact_email}`} className="text-muted-foreground hover:text-blue-600">
                      <Mail className="h-4 w-4" />
                    </a>
                  )}
                  {company.contact_phone && (
                    <a href={`tel:${company.contact_phone}`} className="text-muted-foreground hover:text-blue-600">
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                  {company.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}