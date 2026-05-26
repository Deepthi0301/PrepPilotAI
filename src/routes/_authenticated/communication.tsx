import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { improveCommunication } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/communication")({
  component: Communication,
});

function Communication() {
  const improve = useServerFn(improveCommunication);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ improved: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true); setResult(null);
    try {
      setResult(await improve({ data: { text } }));
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
          placeholder='e.g. "I don\u2019t know coding much"'
          className="mt-2 min-h-28 resize-none bg-background/40"
          maxLength={2000}
        />
        <div className="mt-4 flex justify-end">
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
        </div>
      )}
    </div>
  );
}