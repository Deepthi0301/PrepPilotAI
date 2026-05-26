import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Mic, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { generateInterviewQuestion, evaluateAnswer } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/mock-interview")({
  component: MockInterview,
});

type Type = "hr" | "technical" | "behavioral";
type Feedback = Awaited<ReturnType<typeof evaluateAnswer>>;

function MockInterview() {
  const genQ = useServerFn(generateInterviewQuestion);
  const evalA = useServerFn(evaluateAnswer);
  const [type, setType] = useState<Type | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState<"q" | "e" | null>(null);

  const startOrNext = async (t: Type) => {
    setType(t); setFeedback(null); setAnswer(""); setLoading("q");
    try {
      const { question } = await genQ({ data: { type: t, previousQuestions: history } });
      setQuestion(question);
      setHistory((h) => [...h, question]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load question");
    } finally { setLoading(null); }
  };

  const submit = async () => {
    if (!question || !type || !answer.trim()) return;
    setLoading("e");
    try {
      const fb = await evalA({ data: { type, question, answer } });
      setFeedback(fb);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Evaluation failed");
    } finally { setLoading(null); }
  };

  if (!type) {
    return (
      <div className="mx-auto max-w-4xl animate-fade-in-up">
        <h1 className="text-3xl font-bold">Mock Interview</h1>
        <p className="mt-1 text-muted-foreground">Pick a round to begin practicing.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { id: "hr" as Type, t: "HR Interview", d: "Background, motivation, fit" },
            { id: "technical" as Type, t: "Technical", d: "Concepts, problem solving" },
            { id: "behavioral" as Type, t: "Behavioral", d: "STAR-style scenarios" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => startOrNext(opt.id)}
              className="glass hover-lift rounded-2xl p-6 text-left transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{opt.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{opt.d}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{type} interview</h1>
        <Button variant="ghost" size="sm" onClick={() => { setType(null); setQuestion(null); setHistory([]); setFeedback(null); }}>
          Change round
        </Button>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Question {history.length}
        </div>
        <p className="mt-3 text-lg">
          {loading === "q" ? <Loader2 className="h-5 w-5 animate-spin" /> : question}
        </p>
      </div>

      {!feedback && (
        <div className="glass rounded-2xl p-6">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here…"
            className="min-h-32 resize-none bg-background/40"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={submit}
              disabled={!answer.trim() || loading !== null}
              className="bg-gradient-primary text-primary-foreground"
            >
              {loading === "e" ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Submit answer <ArrowRight className="ml-2 h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      )}

      {feedback && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard label="Professionalism" value={feedback.professionalism} />
            <ScoreCard label="Confidence" value={feedback.confidence} />
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold">Communication feedback</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feedback.communication}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-chart-3">Strengths</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {feedback.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-semibold text-chart-4">To improve</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {feedback.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          </div>
          <div className="glass rounded-2xl bg-gradient-mesh p-6">
            <h3 className="font-semibold">Polished answer</h3>
            <p className="mt-3 text-sm leading-relaxed">{feedback.betterAnswer}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => startOrNext(type)} className="bg-gradient-primary text-primary-foreground">
              Next question <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold text-gradient">{value}</span>
      </div>
      <Progress value={value} className="mt-3 h-2" />
    </div>
  );
}