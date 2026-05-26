import { createFileRoute } from "@tanstack/react-router";
import { Mic, MessageSquare, Flame, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

const data = [
  { day: "Mon", score: 62 }, { day: "Tue", score: 68 }, { day: "Wed", score: 71 },
  { day: "Thu", score: 75 }, { day: "Fri", score: 79 }, { day: "Sat", score: 84 }, { day: "Sun", score: 88 },
];

const stats = [
  { label: "Mock interviews", value: "12", icon: Mic, sub: "+3 this week" },
  { label: "Communication score", value: "88", icon: MessageSquare, sub: "+12 vs last week" },
  { label: "Daily streak", value: "7 days", icon: Flame, sub: "Keep it up!" },
  { label: "Confidence level", value: "High", icon: TrendingUp, sub: "Top 15%" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Your dashboard</h1>
        <p className="mt-1 text-muted-foreground">Track your growth and stay on streak.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass hover-lift rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Weekly progress</h3>
          <p className="text-sm text-muted-foreground">Average score across all modules</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 290)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 290)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 260 / 0.2)" />
                <XAxis dataKey="day" stroke="oklch(0.6 0.02 260)" fontSize={12} />
                <YAxis stroke="oklch(0.6 0.02 260)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="score" stroke="oklch(0.7 0.2 290)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold">Skill breakdown</h3>
          <div className="mt-6 space-y-5">
            {[
              { l: "Professionalism", v: 88 },
              { l: "Confidence", v: 76 },
              { l: "Clarity", v: 84 },
              { l: "Vocabulary", v: 71 },
            ].map((s) => (
              <div key={s.l}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{s.l}</span>
                  <span className="font-medium text-gradient">{s.v}</span>
                </div>
                <Progress value={s.v} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}