import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TimelineEntryProps {
  entry: {
    id: number;
    position: string;
    company: string;
    start_date: string;
    end_date?: string | null;
    is_current?: boolean;
    description?: string;
  };
  icon: React.ReactNode;
  isCurrent?: boolean;
  onEntryClick: (entry: any) => void;
}

export function TimelineEntry({ entry, icon, isCurrent, onEntryClick }: TimelineEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
    });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffYears = end.getFullYear() - start.getFullYear();
    const diffMonths = end.getMonth() - start.getMonth();
    
    let duration = "";
    if (diffYears > 0) {
      duration += `${diffYears} Jahr${diffYears !== 1 ? 'e' : ''}`;
    }
    if (diffMonths > 0) {
      if (duration) duration += " und ";
      duration += `${diffMonths} Monat${diffMonths !== 1 ? 'e' : ''}`;
    }
    return duration;
  };

  return (
    <div 
      className={`relative pl-8 pb-8 border-l-2 ${isCurrent ? 'border-primary' : 'border-muted'} cursor-pointer hover:bg-accent/50 rounded-lg p-4 transition-all ${
        isExpanded ? 'bg-accent/50' : ''
      }`}
      onClick={() => onEntryClick(entry)}
    >
      <div className={`absolute -left-[11px] p-1 bg-background border-2 ${isCurrent ? 'border-primary' : 'border-muted'} rounded-full`}>
        {icon}
      </div>
      <div className="space-y-2">
        <div className="font-medium flex items-center gap-2">
          {entry.position}
          {isCurrent && <Badge variant="outline" className="ml-2">Aktuelle Position</Badge>}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Building className="h-4 w-4" />
          {entry.company}
        </div>
        {entry.start_date && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(entry.start_date)} - {entry.is_current ? "Heute" : formatDate(entry.end_date)}
            <Badge variant="outline" className="ml-2">
              {calculateDuration(entry.start_date, entry.is_current ? null : entry.end_date)}
            </Badge>
          </div>
        )}
        {entry.description && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
        {isExpanded && entry.description && (
          <div className="text-sm text-muted-foreground mt-2">
            {entry.description}
          </div>
        )}
      </div>
    </div>
  );
}