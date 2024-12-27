import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  Award
} from "lucide-react";
import type { Candidate } from "@/types/database.types";
import { useState } from "react";

interface CandidateTimelineProps {
  candidate: Candidate;
}

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  organization: string;
  description: string;
  type: 'education' | 'experience' | 'achievement';
}

export function CandidateTimeline({ candidate }: CandidateTimelineProps) {
  // Mocked timeline data - in a real app, this would come from the database
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      date: '2020 - Present',
      title: candidate.position || 'Current Position',
      organization: candidate.company || 'Current Company',
      description: `Working in ${candidate.department || 'department'} with focus on industry solutions.`,
      type: 'experience'
    },
    {
      id: '2',
      date: '2015 - 2020',
      title: candidate.education || 'Education',
      organization: candidate.university || 'University',
      description: 'Completed degree with honors, focusing on key areas of study.',
      type: 'education'
    }
  ];

  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case 'experience':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-yellow-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Werdegang
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-8">
            {timelineItems.map((item) => (
              <Collapsible
                key={item.id}
                open={openItems.includes(item.id)}
                onOpenChange={() => toggleItem(item.id)}
                className="relative pl-8 transition-all duration-200 ease-in-out group"
              >
                {/* Timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-border group-hover:bg-primary/50 transition-colors" />
                
                {/* Timeline dot */}
                <div className="absolute left-[-8px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background group-hover:border-primary/70 transition-colors" />
                
                <div className="mb-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {item.date}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-auto hover:bg-transparent w-full text-left flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-lg flex items-center gap-2">
                            {getIcon(item.type)}
                            {item.title}
                          </div>
                          <div className="text-muted-foreground">
                            {item.organization}
                          </div>
                        </div>
                        {openItems.includes(item.id) ? (
                          <ChevronUp className="h-4 w-4 mt-1.5 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mt-1.5 shrink-0" />
                        )}
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="mt-2">
                      <div className="text-sm text-muted-foreground pl-7">
                        {item.description}
                      </div>
                    </CollapsibleContent>
                  </div>
                </div>
              </Collapsible>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}