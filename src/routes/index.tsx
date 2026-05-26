import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendChat } from "@/lib/chat.functions";

export const Route = createFileRoute("/")({
  component: Index,
});

type Message = { role: "user" | "assistant"; content: string };

function Index() {
  const chat = useServerFn(sendChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const { reply } = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-lg font-semibold">Simple AI Chat</h1>
          <p className="text-xs text-muted-foreground">Powered by Lovable AI</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6">
        <div className="flex-1 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">Ask me anything to get started.</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "mr-auto max-w-[80%] rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="text-xs text-muted-foreground">Thinking…</div>}
          {error && <div className="text-xs text-destructive">{error}</div>}
        </div>

        <form onSubmit={onSend} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
