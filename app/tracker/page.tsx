"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, Check } from "lucide-react";
import { useSession } from "next-auth/react";
import { PLATFORMS, getPlatformIconPath } from "@/lib/platforms";
import { formatDuration } from "@/lib/usage";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

type Mood = "Happy" | "Neutral" | "Sad" | "Anxious";
type ActivityType = "Browsing" | "Surfing" | "Posting" | "Messaging" | "Research";

interface ApiLogEntry {
  id: string;
  logDate: string;
  duration: number;
  mood: string | null;
  activity: string | null;
  wasProductive: string | null;
  habit: { platform: string };
}

interface LogEntry {
  id: string;
  logDate: string;
  platform: string;
  duration: number;
  mood: Mood;
  activity: ActivityType;
  wasProductive: boolean;
}

const todayKey = () => new Date().toISOString().split("T")[0];

const MOODS: Mood[] = ["Happy", "Neutral", "Sad", "Anxious"];
const ACTIVITIES: ActivityType[] = ["Browsing", "Surfing", "Posting", "Messaging", "Research"];

// Platforms with a real brand icon (LinkedIn has none in /public).
const PICKABLE = PLATFORMS.filter((p) => p !== "LinkedIn");

const SocialMediaTracker = () => {
  const { data: session } = useSession();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState<string>(PICKABLE[0]);
  const [duration, setDuration] = useState(30);
  const [mood, setMood] = useState<Mood>("Neutral");
  const [activity, setActivity] = useState<ActivityType>("Browsing");
  const [wasProductive, setWasProductive] = useState<"yes" | "no">("yes");
  const [logDate, setLogDate] = useState(todayKey());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!session?.user?.id) return;
      try {
        setIsLoading(true);
        const res = await fetch("/api/logs");
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data: ApiLogEntry[] = await res.json();
        setLogs(
          data.map((log): LogEntry => ({
            id: log.id,
            logDate: new Date(log.logDate).toISOString().split("T")[0],
            platform: log.habit.platform,
            duration: log.duration,
            mood: (log.mood as Mood) || "Neutral",
            activity: (log.activity as ActivityType) || "Browsing",
            wasProductive: log.wasProductive === "yes",
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load logs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    setIsSubmitting(true);
    setError(null);
    setJustLogged(false);

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logDate, platform, duration, mood, activity, wasProductive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save log");
      }
      const saved: ApiLogEntry = await res.json();
      setLogs((prev) => [
        {
          id: saved.id,
          logDate: new Date(saved.logDate).toISOString().split("T")[0],
          platform: saved.habit.platform,
          duration: saved.duration,
          mood: (saved.mood as Mood) || "Neutral",
          activity: (saved.activity as ActivityType) || "Browsing",
          wasProductive: saved.wasProductive === "yes",
        },
        ...prev,
      ]);
      setDuration(0);
      setJustLogged(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active
        ? "border-amber-400 bg-amber-400/15 text-amber-300"
        : "border-white/15 bg-white/[0.03] text-gray-300 hover:border-white/30"
    }`;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <section className="general">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-16">
        <PageHeader
          title="Log your day"
          subtitle="Pick an app, set the minutes, and you're done."
        />

        <form onSubmit={handleSubmit} className="panel flex flex-col gap-7">
          {/* Date */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-400">Logging for</span>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="field max-w-[180px]"
              required
            />
          </div>

          {/* Platform tiles */}
          <div>
            <span className="label">Which app?</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {PICKABLE.map((p) => {
                const active = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                      active
                        ? "border-amber-400 bg-amber-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <Image src={getPlatformIconPath(p)} alt="" width={28} height={28} />
                    <span className="text-xs text-white">{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minutes */}
          <div>
            <div className="flex items-center justify-between">
              <span className="label mb-0">How long?</span>
              <span className="text-lg font-semibold text-amber-400">
                {formatDuration(duration)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                aria-label="Decrease minutes"
                onClick={() => setDuration((d) => Math.max(0, d - 5))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition-colors hover:bg-white/10"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <input
                type="range"
                min={0}
                max={300}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-amber-400"
                aria-label="Minutes spent"
              />
              <button
                type="button"
                aria-label="Increase minutes"
                onClick={() => setDuration((d) => Math.min(300, d + 5))}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white transition-colors hover:bg-white/10"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mood */}
          <div>
            <span className="label">How did it feel?</span>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m} type="button" onClick={() => setMood(m)} className={chip(mood === m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div>
            <span className="label">What were you doing?</span>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setActivity(a)}
                  className={chip(activity === a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Productive */}
          <div>
            <span className="label">Was it productive?</span>
            <div className="flex gap-2">
              {(["yes", "no"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setWasProductive(v)}
                  className={chip(wasProductive === v)}
                >
                  {v === "yes" ? "Yes, productive" : "Not really"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          {justLogged && (
            <p className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
              <Check className="h-4 w-4" aria-hidden="true" /> Logged. Keep the streak going.
            </p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="text-base font-semibold">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Saving...
              </>
            ) : (
              "Log it"
            )}
          </Button>
        </form>

        {/* Recent logs */}
        {logs.length > 0 && (
          <div className="panel">
            <h2 className="text-xl font-semibold text-white">Recent logs</h2>
            <ul className="mt-4 divide-y divide-white/10">
              {logs.slice(0, 8).map((log) => (
                <li key={log.id} className="flex items-center gap-4 py-3">
                  <Image
                    src={getPlatformIconPath(log.platform)}
                    alt=""
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{log.platform}</p>
                    <p className="text-xs text-gray-400">
                      {log.logDate} · {log.mood} · {log.activity}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-amber-400">
                    {formatDuration(log.duration)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialMediaTracker;
