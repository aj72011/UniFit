import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

const rubricLabels: { key: string; label: string }[] = [
  { key: "technical_depth", label: "Technical Depth" },
  { key: "innovation", label: "Innovation" },
  { key: "relevance", label: "Relevance" },
  { key: "presentation", label: "Presentation" },
  { key: "methodology", label: "Methodology" },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Tables<"projects"> | null>(null);
  const [grade, setGrade] = useState<Tables<"grades"> | null>(null);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    const fetch = async () => {
      const { data: p } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject(p);
      const { data: g } = await supabase.from("grades").select("*").eq("project_id", id).maybeSingle();
      setGrade(g);
    };
    fetch();
  }, [id, user]);

  const handleGrade = async () => {
    if (!project) return;
    setGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke("grade-project", {
        body: { projectId: project.id },
      });
      if (error) throw error;
      // Refresh grade
      const { data: g } = await supabase.from("grades").select("*").eq("project_id", project.id).maybeSingle();
      setGrade(g);
      // Update project status
      await supabase.from("projects").update({ status: "graded" }).eq("id", project.id);
      setProject(prev => prev ? { ...prev, status: "graded" } : null);
      toast({ title: "Grading complete!", description: `Your project received a ${g?.letter_grade}.` });
    } catch (error: any) {
      toast({ title: "Grading failed", description: error.message, variant: "destructive" });
    } finally {
      setGrading(false);
    }
  };

  if (!project) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            ProjectGrade
          </Link>
        </div>
      </header>

      <main className="container max-w-3xl py-8">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
        </Button>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{project.title}</h1>
            {project.target_university && (
              <p className="mt-1 text-muted-foreground">Target: {project.target_university}</p>
            )}
          </div>
          {grade?.letter_grade && (
            <Badge className="text-lg px-3 py-1">{grade.letter_grade}</Badge>
          )}
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="font-display text-lg">Description</CardTitle></CardHeader>
          <CardContent><p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description || "No description provided."}</p></CardContent>
        </Card>

        {/* Grade Button or Results */}
        {!grade ? (
          <Card className="mb-6 border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-10">
              <Sparkles className="h-10 w-10 text-primary/60" />
              <p className="text-center text-muted-foreground">This project hasn't been graded yet.</p>
              <Button onClick={handleGrade} disabled={grading}>
                {grading ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Grading...</> : <><Sparkles className="mr-1.5 h-4 w-4" /> Grade with AI</>}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overall */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-display text-lg">Overall Score</CardTitle>
                <CardDescription>AI evaluation against {project.target_university || "general"} standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold font-display text-primary">{grade.overall_score}%</div>
                  <Progress value={grade.overall_score ?? 0} className="flex-1" />
                </div>
              </CardContent>
            </Card>

            {/* Rubric Breakdown */}
            <Card className="mb-6">
              <CardHeader><CardTitle className="font-display text-lg">Rubric Breakdown</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {rubricLabels.map(({ key, label }) => {
                  const val = grade[key as keyof typeof grade] as number | null;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{label}</span>
                        <span className="font-medium text-foreground">{val ?? "—"}/100</span>
                      </div>
                      <Progress value={val ?? 0} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Feedback */}
            {grade.feedback && (
              <Card className="mb-6">
                <CardHeader><CardTitle className="font-display text-lg">AI Feedback</CardTitle></CardHeader>
                <CardContent><p className="whitespace-pre-wrap text-sm text-muted-foreground">{grade.feedback}</p></CardContent>
              </Card>
            )}

            {/* Comparison */}
            {grade.comparison_note && (
              <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-primary">{grade.comparison_note}</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProjectDetail;
