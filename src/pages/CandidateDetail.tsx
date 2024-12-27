import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCandidate } from "@/hooks/useCandidate";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { CandidateApplications } from "@/components/candidates/CandidateApplications";
import { CandidateTimeline } from "@/components/candidates/CandidateTimeline";
import { Pencil, Save, X } from "lucide-react";

export default function CandidateDetail() {
  const { id } = useParams();
  const { data: candidate, isLoading, refetch } = useCandidate(Number(id));
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    company: "",
    department: "",
    industry: "",
    experience: "",
    education: "",
    university: "",
  });

  if (isLoading) {
    return <div>Lädt Kandidatendetails...</div>;
  }

  if (!candidate) {
    return <div>Kandidat nicht gefunden</div>;
  }

  const handleEdit = () => {
    setEditedData({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || "",
      position: candidate.position || "",
      company: candidate.company || "",
      department: candidate.department || "",
      industry: candidate.industry || "",
      experience: candidate.experience || "",
      education: candidate.education || "",
      university: candidate.university || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update(editedData)
        .eq("id", candidate.id);

      if (error) throw error;

      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Kandidateninformationen wurden aktualisiert.",
      });
      
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {candidate.name}
            </h1>
            <Badge variant="secondary">{candidate.status}</Badge>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Bearbeiten
            </Button>
          ) : (
            <div className="space-x-2">
              <Button onClick={handleSave} variant="default">
                <Save className="h-4 w-4 mr-2" />
                Speichern
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Abbrechen
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Persönliche Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <Input
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefon</label>
                    <Input
                      value={editedData.phone}
                      onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{candidate.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Telefon</div>
                    <div>{candidate.phone || "Nicht angegeben"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Position</div>
                    <div>{candidate.position || "Nicht angegeben"}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Berufliche Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <Input
                      value={editedData.position}
                      onChange={(e) => setEditedData({ ...editedData, position: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Firma</label>
                    <Input
                      value={editedData.company}
                      onChange={(e) => setEditedData({ ...editedData, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Abteilung</label>
                    <Input
                      value={editedData.department}
                      onChange={(e) => setEditedData({ ...editedData, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Branche</label>
                    <Input
                      value={editedData.industry}
                      onChange={(e) => setEditedData({ ...editedData, industry: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Erfahrung</label>
                    <Input
                      value={editedData.experience}
                      onChange={(e) => setEditedData({ ...editedData, experience: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Firma</div>
                    <div>{candidate.company || "Nicht angegeben"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Abteilung</div>
                    <div>{candidate.department || "Nicht angegeben"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Branche</div>
                    <div>{candidate.industry || "Nicht angegeben"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Erfahrung</div>
                    <div>{candidate.experience || "Nicht angegeben"}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ausbildung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Abschluss</label>
                    <Input
                      value={editedData.education}
                      onChange={(e) => setEditedData({ ...editedData, education: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Universität</label>
                    <Input
                      value={editedData.university}
                      onChange={(e) => setEditedData({ ...editedData, university: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Abschluss</div>
                    <div>{candidate.education || "Nicht angegeben"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Universität</div>
                    <div>{candidate.university || "Nicht angegeben"}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bewerbungen</CardTitle>
            </CardHeader>
            <CardContent>
              <CandidateApplications candidateId={candidate.id} />
            </CardContent>
          </Card>
        </div>

        <CandidateTimeline candidate={candidate} />
      </div>
    </DashboardLayout>
  );
}