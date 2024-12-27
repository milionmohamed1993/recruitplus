import { Card } from "@/components/ui/card";
import { useCandidates } from "@/hooks/useCandidates";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
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
  const [positionFilter, setPositionFilter] = useState<string>("");

  if (isLoading) {
    return <div>Lädt Kandidaten...</div>;
  }

  const positions = Array.from(
    new Set(candidates?.map((candidate) => candidate.position) || [])
  );

  const filteredCandidates = candidates?.filter((candidate) => {
    const matchesSearch = candidate.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPosition = positionFilter === "" || candidate.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Nach Name oder Email suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={positionFilter} onValueChange={setPositionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Position filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Alle Positionen</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
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