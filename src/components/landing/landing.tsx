import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Mic,
  MessageSquare,
  Brain,
  Users,
  LineChart,
  ArrowRight,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  { icon: Mic, title: "AI Mock Interviews", desc: "HR, technical and behavioral rounds with instant scoring and rewritten answers." },
  { icon: MessageSquare, title: "Communication Improver", desc: "Turn casual sentences into polished, interview-ready English in one click." },
  { icon: Brain, title: "Daily Speaking Challenge", desc: "Fresh 60-second prompts to build fluency, confidence and quick thinking." },
  { icon: Users, title: "Group Discussion Prep", desc: "Talking points, supporting and counter arguments — never go in unprepared." },
  { icon: LineChart, title: "Progress Dashboard", desc: "Track scores, streaks and confidence growth with beautiful analytics." },
  { icon: Zap, title: "Beginner-Friendly Feedback", desc: "Kind, honest coaching that actually helps you improve — never harsh." },
];

const steps = [
  { n: "01", t: "Pick a module", d: "Choose mock interview, communication coach, daily challenge or GD prep." },
  { n: "02", t: "Practice with AI", d: "Answer realistic questions, type your responses and speak freely." },
  { n: "03", t: "Get smart feedback", d: "Receive scores, strengths, weaknesses and a polished rewritten version." },
  { n: "04", t: "Track your growth", d: "Watch confidence and communication scores climb on your dashboard." },
];

const testimonials = [
  { name: "Aarav S.", role: "CS Student, IIT", quote: "Cracked my first internship interview after two weeks of PrepPilot. The HR round felt easy." },
  { name: "Priya M.", role: "MBA Aspirant", quote: "The communication improver is gold. I finally sound confident in interviews." },
  { name: "Rohit K.", role: "Final-year ECE", quote: "Daily speaking challenge fixed my hesitation. I actually look forward to it." },
];

const faqs = [
  { q: "Is PrepPilot AI free to try?", a: "Yes. Sign up and explore every module — no credit card needed." },
  { q: "Which interviews does it cover?", a: "HR, behavioral and technical rounds for internships and entry-level roles across domains." },
  { q: "Does it actually help me improve?", a: "Yes. Each session gives professionalism + confidence scores plus a rewritten answer so you learn fast." },
  { q: "Can I use it on mobile?", a: "Absolutely. PrepPilot AI is fully responsive — practice anywhere, anytime." },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">PrepPilot<span className="text-gradient">AI</span></span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition hover:text-foreground">Features</a>
            <a href="#how" className="text-sm text-muted-foreground transition hover:text-foreground">How it works</a>
            <a href="#testimonials" className="text-sm text-muted-foreground transition hover:text-foreground">Stories</a>
            <a href="#faq" className="text-sm text-muted-foreground transition hover:text-foreground">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-primary opacity-20 blur-3xl animate-float" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              AI Communication & Interview Coach
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Practice. Improve.{" "}
              <span className="text-gradient">Get Interview Ready.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              Your personal AI coach for mock interviews, communication skills and speaking
              confidence. Built for students preparing for internships and placements.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="group bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  Start Mock Interview
                  <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="glass border-border/60">
                  Improve Communication
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Free to start</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Beginner-friendly</span>
            </div>
          </div>

          {/* hero card preview */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="glass rounded-3xl p-2 shadow-glow">
              <div className="rounded-2xl bg-card p-6 md:p-8">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-chart-4/70" />
                    <div className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
                  </div>
                  <span className="text-xs text-muted-foreground">HR Interview · Question 3 of 8</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-muted/60 p-4 text-sm">
                    <span className="font-medium text-primary">AI Coach:</span> Tell me about a time you handled a difficult teammate.
                  </div>
                  <div className="ml-auto max-w-[80%] rounded-2xl bg-gradient-primary p-4 text-sm text-primary-foreground">
                    During my final-year project, a teammate kept missing deadlines. I scheduled a 1:1, understood their workload and redistributed tasks — we shipped on time.
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-4">
                    {[
                      { l: "Professionalism", v: "92" },
                      { l: "Confidence", v: "88" },
                      { l: "Clarity", v: "90" },
                      { l: "Overall", v: "A" },
                    ].map((m) => (
                      <div key={m.l} className="rounded-xl border border-border/60 bg-background/40 p-3 text-center">
                        <div className="text-2xl font-bold text-gradient">{m.v}</div>
                        <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Everything you need to nail your interview</h2>
          <p className="mt-4 text-muted-foreground">Six focused modules. One confident you.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group glass hover-lift rounded-2xl p-6 animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-y border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">From nervous to interview-ready in 4 steps</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border/60 bg-card p-6 hover-lift">
                <div className="text-3xl font-bold text-gradient">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Loved by students</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Confidence, built one practice at a time</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6 hover-lift">
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/40 bg-muted/20 py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <p className="text-sm font-medium text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">Questions, answered</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-border/60">
                <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="glass rounded-3xl bg-gradient-mesh p-12 text-center shadow-glow md:p-16">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to ace your next interview?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join students preparing smarter — not harder — with PrepPilot AI.
          </p>
          <Link to="/login" className="mt-8 inline-block">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              Start free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span>© {new Date().getFullYear()} PrepPilot AI — Built for students</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <Link to="/login" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}