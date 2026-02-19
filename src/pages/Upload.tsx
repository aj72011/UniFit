import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Upload as UploadIcon, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [university, setUniversity] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let fileUrl: string | null = null;

      if (file) {
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("project-files")
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        fileUrl = filePath;
      }

      const { data, error } = await supabase.from("projects").insert({
        user_id: user.id,
        title,
        description,
        target_university: university || null,
        file_url: fileUrl,
      }).select().single();

      if (error) throw error;

      toast({ title: "Project uploaded!", description: "Grading will begin shortly." });
      navigate(`/project/${data.id}`);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
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
        </div>
      </header>

      <main className="container max-w-2xl py-8">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Upload Project</CardTitle>
            <CardDescription>Submit your project for AI-powered grading.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Research Project" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">Target University</Label>
                <Input id="university" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="e.g. MIT, Stanford, Oxford" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your project, methodology, and findings..." rows={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Attach File (optional)</Label>
                <Input id="file" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT (max 20MB)</p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <UploadIcon className="mr-1.5 h-4 w-4" />
                {loading ? "Uploading..." : "Submit for Grading"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;
