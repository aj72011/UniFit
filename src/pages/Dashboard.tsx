import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Plus, LogOut, FileText, BarChart3, Users } from "lucide-react";
import { guestProjects, type DashboardProject } from "@/lib/guest-data";

const Dashboard = () => {
  const { user, isGuest, signOut } = useAuth();
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      setProjects(guestProjects);
      setLoading(false);
      return;
    }

    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*, grades(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setProjects(data || []);
      setLoading(false);
    };
    fetchProjects();
  }, [isGuest, user]);

  const gradeColor = (grade?: string | null) => {
    if (!grade) return "secondary";
    if (["A+", "A", "A-"].includes(grade)) return "default";
    if (["B+", "B", "B-"].includes(grade)) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            ProjectGrade
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/professors"><Users className="mr-1.5 h-4 w-4" /> Professors</Link></Button>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-1.5 h-4 w-4" /> {isGuest ? "Exit guest" : "Log out"}</Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">{isGuest ? "Guest demo mode. Data is temporary and read-only." : "Manage your projects and track your progress."}</p>
          </div>
          {isGuest ? (
            <Button asChild><Link to="/auth?tab=signup">Create Account</Link></Button>
          ) : (
            <Button asChild><Link to="/upload"><Plus className="mr-1.5 h-4 w-4" /> New Project</Link></Button>
          )}
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileText, label: "Projects", value: projects.length },
            { icon: BarChart3, label: "Graded", value: projects.filter(p => p.grades.length > 0).length },
            { icon: GraduationCap, label: "Avg Score", value: projects.length > 0 ? Math.round(projects.filter(p => p.grades[0]?.overall_score).reduce((a, p) => a + (p.grades[0]?.overall_score || 0), 0) / Math.max(projects.filter(p => p.grades[0]?.overall_score).length, 1)) + "%" : "—" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects */}
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <div className="text-center">
                <h3 className="font-display text-lg font-semibold text-foreground">No projects yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Upload your first project to get started.</p>
              </div>
              <Button asChild><Link to="/upload"><Plus className="mr-1.5 h-4 w-4" /> Upload Project</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link to={`/project/${p.id}`} key={p.id}>
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-display text-lg">{p.title}</CardTitle>
                      {p.grades[0]?.letter_grade && (
                        <Badge variant={gradeColor(p.grades[0].letter_grade)}>{p.grades[0].letter_grade}</Badge>
                      )}
                    </div>
                    <CardDescription>{p.target_university || "No university selected"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{p.status === "graded" ? `Score: ${p.grades[0]?.overall_score}%` : p.status}</span>
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
