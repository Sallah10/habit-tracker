"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORMS, getPlatformIconPath } from "@/lib/platforms";

// A minute-long setup so the dashboard is never empty and goals are personal.
const Onboarding = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [goals, setGoals] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const firstName = session?.user?.name?.split(" ")[0] || "there";
  // LinkedIn has no brand icon in /public, so it stays out of the icon grid.
  const grid = PLATFORMS.filter((p) => p !== "LinkedIn");

  const toggle = (platform: string) => {
    setSelected((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const goalFor = (platform: string) => goals[platform] ?? 60;
  const setGoal = (platform: string, value: number) =>
    setGoals((prev) => ({ ...prev, [platform]: value }));

  const finish = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habits: selected.map((platform) => ({
            platform,
            goalDuration: goalFor(platform),
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
        setSaving(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(`Network error. Please try again. ${err}`);
      setSaving(false);
    }
  };

  return (
    <section className="general min-h-screen items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#33313f] p-6 shadow-2xl sm:p-8">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= step ? "w-10 bg-brand" : "w-6 bg-white/15"
              }`}
            />
          ))}
        </div>

        {/* Step 0 - welcome */}
        {step === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              Welcome, {firstName}.
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-gray-300">
              Let&apos;s set up your tracker. Two quick questions, then you&apos;re
              logging your first day. You log your usage yourself - it takes about
              ten seconds a day.
            </p>
            <Button
              size="lg"
              className="mt-8 w-full text-base font-semibold"
              onClick={() => setStep(1)}
            >
              Let&apos;s go
            </Button>
          </div>
        )}

        {/* Step 1 - pick platforms */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-white">
              Which apps do you want to keep an eye on?
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Pick as many as you like. You can change this later.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {grid.map((platform) => {
                const active = selected.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggle(platform)}
                    aria-pressed={active}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors ${
                      active
                        ? "border-brand bg-brand/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand">
                        <Check className="h-3 w-3 text-[#26252F]" aria-hidden="true" />
                      </span>
                    )}
                    <Image
                      src={getPlatformIconPath(platform)}
                      alt=""
                      width={32}
                      height={32}
                    />
                    <span className="text-sm text-white">{platform}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <Button
                className="px-8 text-base font-semibold"
                disabled={selected.length === 0}
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 - set goals */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-white">
              Set a daily goal for each.
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Aim for a number you can actually hit. Staying under it counts as a
              win.
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {selected.map((platform) => (
                <div key={platform}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-white">
                      <Image
                        src={getPlatformIconPath(platform)}
                        alt=""
                        width={22}
                        height={22}
                      />
                      {platform}
                    </span>
                    <span className="text-sm font-semibold text-brand">
                      {goalFor(platform)} min / day
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={240}
                    step={5}
                    value={goalFor(platform)}
                    onChange={(e) => setGoal(platform, Number(e.target.value))}
                    className="mt-2 w-full accent-brand"
                    aria-label={`${platform} daily goal in minutes`}
                  />
                </div>
              ))}
            </div>

            {error && (
              <p className="mt-5 rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              <Button
                className="px-8 text-base font-semibold"
                disabled={saving}
                onClick={finish}
              >
                {saving ? "Saving..." : "Start tracking"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Onboarding;
