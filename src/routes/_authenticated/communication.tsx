import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { improveCommunication, analyzeSpeaking } from "@/lib/ai.functions";
import { VoiceInput } from "@/components/voice-input";

export const Route = createFileRoute("/_authenticated/communication")({
  component: Communication,
});

function Communication() {
  const improve = useServerFn(improveCommunication);
  const analyze = useServerFn(analyzeSpeaking);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ improved: string; explanation: string } | null>(null);
  const [feedback, setFeedback] = useState<Awaited<ReturnType<typeof analyzeSpeaking>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null); setFeedback(null);
    try {
      setResult(await improve({ data: { text } }));
      try {
        setAnalyzing(true);
        setFeedback(await analyze({ data: { transcript: text, context: "Communication practice" } }));
      } catch (e) {
        // non-fatal
        console.error(e);
      } finally { setAnalyzing(false); }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Communication Improver</h1>
        <p className="mt-1 text-muted-foreground">Turn casual English into polished, interview-ready answers.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <label className="text-sm font-medium">Your sentence</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type or speak — e.g. "I don\u2019t know coding much"'
          className="mt-2 min-h-28 resize-none bg-background/40"
          maxLength={2000}
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <VoiceInput value={text} onChange={setText} label="Speak" />
          <Button onClick={submit} disabled={!text.trim() || loading} className="bg-gradient-primary text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wand2 className="mr-2 h-4 w-4" /> Improve</>}
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Original</p>
            <p className="mt-2 text-sm">{text}</p>
          </div>
          <div className="glass rounded-2xl bg-gradient-mesh p-6">
            <p className="text-xs uppercase tracking-wider text-primary">Improved</p>
            <p className="mt-2 text-base leading-relaxed">{result.improved}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Why it works</p>
            <p className="mt-2 text-sm text-muted-foreground">{result.explanation}</p>
          </div>

          {(analyzing || feedback) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI feedback on your speaking</h3>
              {analyzing && !feedback && (
                <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Analyzing your communication…
                </div>
              )}
              {feedback && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric label="Clarity" value={feedback.clarity} />
                    <Metric label="Confidence" value={feedback.confidence} />
                    <Metric label="Grammar" value={feedback.grammarScore} />
                    <Metric label="Fluency" value={feedback.fluency} />
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <p className="text-sm">{feedback.summary}</p>
                  </div>
                  {feedback.grammarMistakes.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-semibold text-chart-4">Grammar mistakes</h4>
                      <ul className="mt-2 space-y-1.5 text-sm">{feedback.grammarMistakes.map((g, i) => <li key={i}>• {g}</li>)}</ul>
                    </div>
                  )}
                  {feedback.improvementSuggestions.length > 0 && (
                    <div className="glass rounded-2xl p-6">
                      <h4 className="font-semibold text-primary">Improvement tips</h4>
                      <ul className="mt-2 space-y-1.5 text-sm">{feedback.improvementSuggestions.map((s, i) => <li key={i}>💡 {s}</li>)}</ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-2xl font-bold text-gradient">{value}</span>
      </div>
      <Progress value={value} className="mt-3 h-2" />
    </div>
  );
}