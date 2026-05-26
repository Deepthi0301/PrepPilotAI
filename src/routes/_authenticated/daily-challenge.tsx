import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Play, Pause, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSpeakingTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/daily-challenge")({
  component: DailyChallenge,
});

function DailyChallenge() {
  const gen = useServerFn(generateSpeakingTopic);
  const [topic, setTopic] = useState<{ topic: string; category: string; hints: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const fetchTopic = async () => {
    setLoading(true); reset();
    try { setTopic(await gen({ data: {} })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to fetch topic"); }
    finally { setLoading(false); }
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { if (timer.current) clearInterval(timer.current); setRunning(false); toast.success("Time's up! Well spoken."); return 0; }
        return s - 1;
      });
    }, 1000);
  };
  const pause = () => { if (timer.current) clearInterval(timer.current); setRunning(false); };
  const reset = () => { pause(); setSeconds(60); };

  const pct = ((60 - seconds) / 60) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Daily Speaking Challenge</h1>
        <p className="mt-1 text-muted-foreground">Speak for 60 seconds on a fresh topic.</p>
      </div>

      <div className="glass rounded-2xl p-8 text-center">
        {!topic ? (
          <Button onClick={fetchTopic} disabled={loading} size="lg" className="bg-gradient-primary text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" /> Get today's topic</>}
          </Button>
        ) : (
          <>
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
              {topic.category}
            </span>
            <h2 className="mt-4 text-2xl font-bold">{topic.topic}</h2>
            <div className="mt-6 space-y-2">
              {topic.hints.map((h, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3 text-left text-sm">💡 {h}</div>
              ))}
            </div>
          </>
        )}
      </div>

      {topic && (
        <div className="glass rounded-2xl p-8">
          <div className="relative mx-auto h-44 w-44">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.5 0.02 260 / 0.2)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="url(#grad)" strokeWidth="6"
                strokeLinecap="round" strokeDasharray={`${(pct * 283) / 100} 283`}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.2 290)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 295)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div>
                <div className="text-4xl font-bold tabular-nums">{String(seconds).padStart(2, "0")}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">seconds</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-3">
            {!running ? (
              <Button onClick={start} className="bg-gradient-primary text-primary-foreground" disabled={seconds === 0}>
                <Play className="mr-2 h-4 w-4" /> Start
              </Button>
            ) : (
              <Button onClick={pause} variant="outline"><Pause className="mr-2 h-4 w-4" /> Pause</Button>
            )}
            <Button onClick={reset} variant="ghost"><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
            <Button onClick={fetchTopic} variant="ghost"><Sparkles className="mr-2 h-4 w-4" /> New topic</Button>
          </div>
        </div>
      )}
    </div>
  );
}