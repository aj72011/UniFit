import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, BarChart3, Lightbulb, GraduationCap, ArrowRight, Sparkles, Target, Users } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const steps = [
  { icon: Upload, title: "Upload", desc: "Submit your project files or paste a description" },
  { icon: BarChart3, title: "Grade", desc: "AI evaluates against your target university's standards" },
  { icon: Lightbulb, title: "Discover", desc: "Get research ideas matched to professors" },
];

const features = [
  { icon: Sparkles, title: "AI-Powered Grading", desc: "Get detailed rubric-based feedback aligned with top university standards." },
  { icon: Target, title: "University Matching", desc: "See how your project compares against specific programs and departments." },
  { icon: Users, title: "Professor Insights", desc: "Discover research ideas tailored to professors you want to work with." },
  { icon: GraduationCap, title: "Track Progress", desc: "Monitor improvement across submissions and build a stronger portfolio." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            ProjectGrade
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild><Link to="/auth?guest=1">Try as Guest</Link></Button>
            <Button variant="ghost" asChild><Link to="/auth">Log in</Link></Button>
            <Button asChild><Link to="/auth?tab=signup">Get Started</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(245_58%_51%/0.08),transparent_60%)]" />
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered project evaluation
            </span>
          </motion.div>
          <motion.h1
            className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Grade your projects against{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              top university standards
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Upload your academic projects, receive AI-driven grades, and discover research ideas tailored to professors at your dream universities.
          </motion.p>
          <motion.div className="mt-10 flex flex-wrap justify-center gap-4" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Button size="lg" asChild>
              <Link to="/auth?tab=signup">Start Grading <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth?guest=1">Try as Guest</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#how-it-works">See How It Works</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border/50 bg-card py-24">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">Three simple steps to get university-level feedback on your projects.</p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="relative overflow-hidden border-border/60 bg-background text-center">
                  <CardContent className="flex flex-col items-center gap-4 p-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="absolute right-4 top-4 font-display text-5xl font-bold text-muted/60">{i + 1}</span>
                    <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">Everything You Need</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Card className="h-full border-border/60 transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-primary py-20 text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">Ready to level up your projects?</h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
            Join students who are getting smarter feedback and landing research opportunities.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link to="/auth?tab=signup">Get Started Free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-display font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" /> ProjectGrade
          </span>
          <span>© {new Date().getFullYear()} ProjectGrade. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
