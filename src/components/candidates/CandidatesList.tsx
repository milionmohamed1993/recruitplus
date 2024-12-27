import { Card } from "@/components/ui/card";
import { useCandidates } from "@/hooks/useCandidates";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CandidatesList() {
  const { data: candidates, isLoading } = useCandidates();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");

  if (isLoading) {
    return <div>Lädt Kandidaten...</div>;
  }

  const positions = Array.from(
    new Set(candidates?.map((candidate) => candidate.position) || [])
  );

  const filteredCandidates = candidates?.filter((candidate) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = positionFilter === "all" || candidate.position === positionFilter;
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Kandidaten</h2>
          <p className="text-muted-foreground">
            Verwalten Sie hier Ihre Kandidaten und deren Bewerbungsprozesse.
          </p>
        </div>
        <Button asChild>
          <Link to="/candidates/add" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Kandidat hinzufügen
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Nach Name oder Email suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Position filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Positionen</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Pipeline-Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="new">Neu</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Angebot</SelectItem>
            <SelectItem value="hired">Eingestellt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Erfahrung" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Erfahrungsstufen</SelectItem>
            <SelectItem value="junior">Junior (0-2 Jahre)</SelectItem>
            <SelectItem value="mid">Mid-Level (3-5 Jahre)</SelectItem>
            <SelectItem value="senior">Senior (5+ Jahre)</SelectItem>
            <SelectItem value="lead">Lead (8+ Jahre)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredCandidates?.map((candidate) => (
          <Card key={candidate.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{candidate.name}</div>
                <div className="text-sm text-muted-foreground">
                  {candidate.position}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {candidate.email}
                </div>
                <div className="text-sm mt-1">
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                    {candidate.status}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/candidates/${candidate.id}/pipeline`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Pipeline anzeigen
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}