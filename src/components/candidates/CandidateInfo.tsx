import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { Candidate } from "@/types/database.types";
import { BasicInfoSection } from "./info/BasicInfoSection";
import { PersonalInfoDisplay } from "./info/PersonalInfoDisplay";
import { ProfessionalInfoDisplay } from "./info/ProfessionalInfoDisplay";
import { EducationInfoDisplay } from "./info/EducationInfoDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CandidateInfoProps {
  candidate: Candidate;
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCandidate, setEditedCandidate] = useState(candidate);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update(editedCandidate)
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Änderungen gespeichert",
        description: "Die Kandidateninformationen wurden erfolgreich aktualisiert.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        {isEditing ? (
          <Input
            value={editedCandidate.name}
            onChange={(e) =>
              setEditedCandidate({ ...editedCandidate, name: e.target.value })
            }
            className="max-w-[200px]"
          />
        ) : (
          <CardTitle>{candidate.name}</CardTitle>
        )}
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditedCandidate(candidate);
                setIsEditing(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <BasicInfoSection
          candidate={candidate}
          isEditing={isEditing}
          editedCandidate={editedCandidate}
          setEditedCandidate={setEditedCandidate}
        />

        <div className="mt-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="personal">Persönliche Informationen</TabsTrigger>
              <TabsTrigger value="professional">Berufliche Informationen</TabsTrigger>
              <TabsTrigger value="education">Ausbildung</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <PersonalInfoDisplay
                candidate={candidate}
                isEditing={isEditing}
                editedCandidate={editedCandidate}
                setEditedCandidate={setEditedCandidate}
              />
            </TabsContent>

            <TabsContent value="professional" className="mt-4">
              <ProfessionalInfoDisplay
                candidate={candidate}
                isEditing={isEditing}
                editedCandidate={editedCandidate}
                setEditedCandidate={setEditedCandidate}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-4">
              <EducationInfoDisplay
                candidate={candidate}
                isEditing={isEditing}
                editedCandidate={editedCandidate}
                setEditedCandidate={setEditedCandidate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}