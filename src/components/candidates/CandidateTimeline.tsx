import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar, 
  Building, 
  ChevronDown, 
  ChevronUp,
  Star,
  StarHalf 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/database.types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CandidateTimelineProps {
  candidate: Candidate;
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: workHistory } = useQuery({
    queryKey: ["candidate-work-history", candidate.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidate_work_history")
        .select("*")
        .eq("candidate_id", candidate.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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

  const renderSkillLevel = (index: number) => {
    const totalStars = 5;
    const level = Math.min(5, Math.max(1, Math.ceil((index + 1) * 5 / (candidate.skills?.length || 1))));
    
    return (
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < level ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Werdegang</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Current Position */}
          {candidate.position && (
            <div 
              className="relative pl-8 pb-8 border-l-2 border-primary cursor-pointer hover:bg-accent/50 rounded-lg p-4"
              onClick={() => {
                setSelectedEntry({
                  position: candidate.position,
                  company: candidate.company,
                  description: "Aktuelle Position",
                  duration: "Aktuell"
                });
                setDialogOpen(true);
              }}
            >
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-primary rounded-full">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="font-medium flex items-center gap-2">
                  {candidate.position}
                  <Badge variant="outline" className="ml-2">Aktuelle Position</Badge>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {candidate.company}
                </div>
              </div>
            </div>
          )}

          {/* Work History */}
          {workHistory?.map((entry, index) => (
            <div 
              key={entry.id}
              className={`relative pl-8 pb-8 border-l-2 border-muted cursor-pointer hover:bg-accent/50 rounded-lg p-4 transition-all ${
                expandedEntry === index ? 'bg-accent/50' : ''
              }`}
              onClick={() => {
                setSelectedEntry(entry);
                setDialogOpen(true);
              }}
            >
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">{entry.position}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {entry.company}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(entry.start_date)} - {entry.is_current ? "Heute" : formatDate(entry.end_date)}
                  <Badge variant="outline" className="ml-2">
                    {calculateDuration(entry.start_date, entry.is_current ? null : entry.end_date)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedEntry(expandedEntry === index ? null : index);
                  }}
                >
                  {expandedEntry === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                {expandedEntry === index && entry.description && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {entry.description}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Education */}
          {candidate.education && (
            <div className="relative pl-8 pb-8 border-l-2 border-muted">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="font-medium">{candidate.education}</div>
                {candidate.university && (
                  <div className="text-sm text-muted-foreground">
                    {candidate.university}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills with Ratings */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="relative pl-8 border-l-2 border-muted">
              <div className="absolute -left-[11px] p-1 bg-background border-2 border-muted rounded-full">
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="font-medium">Fähigkeiten</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidate.skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-accent/50 p-3 rounded-lg"
                    >
                      <span>{skill}</span>
                      {renderSkillLevel(index)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEntry?.position}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{selectedEntry?.company}</span>
            </div>
            {selectedEntry?.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(selectedEntry.start_date)} - {selectedEntry.is_current ? "Heute" : formatDate(selectedEntry.end_date)}
                </span>
              </div>
            )}
            {selectedEntry?.description && (
              <div className="text-sm text-muted-foreground">
                {selectedEntry.description}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}