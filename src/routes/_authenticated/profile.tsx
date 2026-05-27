import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, Mail, Calendar, User as UserIcon, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  target_role: string | null;
  experience_level: string | null;
  skills: string[] | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

const LEVELS = ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"];

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skillDraft, setSkillDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");
      setCreatedAt(user.created_at ?? "");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setProfile(
        data ?? {
          full_name: (user.user_metadata as any)?.full_name ?? "",
          avatar_url: (user.user_metadata as any)?.avatar_url ?? null,
          target_role: "",
          experience_level: "",
          skills: [],
          bio: "",
          created_at: user.created_at ?? new Date().toISOString(),
          updated_at: user.created_at ?? new Date().toISOString(),
        },
      );
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => (p ? { ...p, [k]: v } : p));

  const addSkill = () => {
    const s = skillDraft.trim();
    if (!s) return;
    const existing = profile?.skills ?? [];
    if (existing.includes(s)) return setSkillDraft("");
    update("skills", [...existing, s]);
    setSkillDraft("");
  };

  const removeSkill = (s: string) =>
    update("skills", (profile?.skills ?? []).filter((x) => x !== s));

  const save = async () => {
    if (!userId || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          target_role: profile.target_role,
          experience_level: profile.experience_level,
          skills: profile.skills ?? [],
          bio: profile.bio,
        },
        { onConflict: "user_id" },
      );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 4 * 1024 * 1024) return toast.error("Max 4MB");
    setUploading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    update("avatar_url", publicUrl);
    setUploading(false);
    toast.success("Avatar uploaded — don't forget to save");
  };

  if (loading || !profile) {
    return <div className="grid min-h-[40vh] place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const initials = (profile.full_name || email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold">Your profile</h1>
        <p className="mt-1 text-muted-foreground">Personalize feedback by telling PrepPilot AI about you.</p>
      </div>

      <div className="glass rounded-2xl bg-gradient-mesh p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-2 ring-primary/30">
              <AvatarImage src={profile.avatar_url ?? undefined} />
              <AvatarFallback className="bg-gradient-primary text-xl text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105"
              type="button"
              aria-label="Upload avatar"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
          </div>

          <div className="flex-1 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined {new Date(createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-4 w-4" /> Last updated {new Date(profile.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Basic details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={profile.full_name ?? ""} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label>Target role</Label>
            <Input value={profile.target_role ?? ""} onChange={(e) => update("target_role", e.target.value)} placeholder="e.g. Frontend Developer" />
          </div>
          <div className="space-y-1.5">
            <Label>Experience level</Label>
            <select
              value={profile.experience_level ?? ""}
              onChange={(e) => update("experience_level", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select…</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Bio</Label>
            <Textarea value={profile.bio ?? ""} onChange={(e) => update("bio", e.target.value)} maxLength={400} placeholder="Tell us a bit about yourself…" className="min-h-24 resize-none" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Skills & languages</h2>
        <p className="text-sm text-muted-foreground">Add tags so mock interviews target your strengths.</p>
        <div className="mt-4 flex gap-2">
          <Input
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
            placeholder="e.g. React, Python, Public speaking"
          />
          <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(profile.skills ?? []).map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 pl-3 pr-1.5">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="rounded-full p-0.5 hover:bg-foreground/10">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(profile.skills ?? []).length === 0 && <span className="text-xs text-muted-foreground">No skills yet</span>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
        </Button>
      </div>
    </div>
  );
}