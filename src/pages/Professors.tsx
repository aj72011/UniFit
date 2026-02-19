import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, ArrowLeft, Sparkles, Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

const Professors = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [professors, setProfessors] = useState<Tables<"professors">[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("professors").select("*").order("name");
      setProfessors(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = professors.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.university.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      (p.research_areas || []).some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  const generateIdeas = async (professor: Tables<"professors">) => {
    if (!user) { toast({ title: "Please log in", variant: "destructive" }); return; }
    setGeneratingId(professor.id);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ideas", {
        body: { professorId: professor.id },
      });
      if (error) throw error;
      toast({ title: "Ideas generated!", description: "Check your dashboard for saved suggestions." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            ProjectGrade
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Button variant="ghost" size="sm" asChild><Link to="/dashboard">Dashboard</Link></Button>
                <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="mr-1.5 h-4 w-4" /> Log out</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/dashboard"><ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard</Link>
        </Button>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Professor Directory</h1>
          <p className="mt-1 text-muted-foreground">Browse professors and get AI-generated research ideas.</p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, university, or research area..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No professors found. Try a different search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prof) => (
              <Card key={prof.id} className="h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg">{prof.name}</CardTitle>
                  <CardDescription>{prof.department} · {prof.university}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(prof.research_areas || []).map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">{area}</Badge>
                    ))}
                  </div>
                  {user && (
                    <Button size="sm" variant="outline" className="w-full" onClick={() => generateIdeas(prof)} disabled={generatingId === prof.id}>
                      {generatingId === prof.id ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Generating...</> : <><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Get Research Ideas</>}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Professors;
