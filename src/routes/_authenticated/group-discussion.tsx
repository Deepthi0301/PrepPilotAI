import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateGDPack } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/group-discussion")({
  component: GroupDiscussion,
});

type Pack = Awaited<ReturnType<typeof generateGDPack>>;

function GroupDiscussion() {
  const gen = useServerFn(generateGDPack);
  const [topic, setTopic] = useState("");
  const [pack, setPack] = useState<Pack | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setPack(null);
    try { setPack(await gen({ data: { topic: topic || undefined } })); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed to generate"); }
    finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Group Discussion Prep</h1>
        <p className="mt-1 text-muted-foreground">Talking points, arguments and counters — generated instantly.</p>
      </div>

      <div className="glass rounded-2xl p-6">
        <label className="text-sm font-medium">Topic (optional)</label>
        <div className="mt-2 flex gap-2">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Leave empty for a random topic" />
          <Button onClick={submit} disabled={loading} className="bg-gradient-primary text-primary-foreground">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" /> Generate</>}
          </Button>
        </div>
      </div>

      {pack && (
        <div className="space-y-4">
          <div className="glass rounded-2xl bg-gradient-mesh p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
              <Users className="h-3.5 w-3.5" /> GD Topic
            </div>
            <h2 className="mt-2 text-2xl font-bold">{pack.topic}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Points to speak" items={pack.pointsToSpeak} />
            <Section title="Supporting arguments" items={pack.supportingArguments} />
            <Section title="Counter arguments" items={pack.counterArguments} />
            <Section title="Communication tips" items={pack.communicationTips} />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((s, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span><span>{s}</span></li>)}
      </ul>
    </div>
  );
}