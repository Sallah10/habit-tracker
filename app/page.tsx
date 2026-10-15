import Image from "next/image";
import Link from "next/link";
import { Flame, LineChart, TimerReset, Smartphone, Check } from "lucide-react";
import bgImage from "/app/assets/BGHabit2.png";
import logo from "/app/assets/HabiTapp.png";
import { Button } from "@/components/ui/button";

// The daily loop, in order. This is the whole product - everything else is detail.
const steps = [
  {
    icon: TimerReset,
    step: "01",
    title: "Log your day",
    body: "Tap the apps you used, slide the minutes, pick a mood. Ten seconds and you're done.",
  },
  {
    icon: LineChart,
    step: "02",
    title: "See the pattern",
    body: "Your week, your totals, your most-used apps - turned into something you can actually read.",
  },
  {
    icon: Flame,
    step: "03",
    title: "Build the habit",
    body: "Show up daily and your streak grows. Miss a day and it resets. Simple, and weirdly motivating.",
  },
];

export default function Home() {
  return (
    <div className="flex w-full flex-col">
      {/* ---- Hero ---- */}
      <section className="relative flex min-h-[92svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        <Image src={bgImage} alt="" quality={100} priority fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#26252F]" />

        <div className="relative z-10 flex max-w-3xl flex-col items-center">
          <Image src={logo} alt="HabiTapp" width={240} height={88} priority />
          <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Take your time back.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-200">
            You open your phone for five minutes and lose an hour. HabiTapp shows
            you where it actually goes - so you can build better habits, one tap
            at a time.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full px-8 text-base font-semibold sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Sign in
              </Button>
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
            Free to use. Works on your phone.
          </p>
        </div>
      </section>

      {/* ---- The problem ---- */}
      <section className="border-t border-white/10 bg-[#26252F] px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              A screen time report tells you the number. It doesn&apos;t tell you
              what to do about it.
            </h2>
            <p className="mt-5 text-gray-300">
              HabiTapp is built around one small daily ritual: log what you did,
              see it plainly, and try to do a little better tomorrow. No guilt,
              no lectures - just a mirror.
            </p>
            <ul className="mt-7 space-y-3">
              {["Know where your hours really go", "Set a goal per app and track it", "Keep a streak going day after day"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-200">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400">
                      <Check className="h-3.5 w-3.5 text-[#26252F]" aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* A little product mock so the page isn't just words. */}
          <div className="rounded-3xl border border-white/10 bg-[#33313f] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Today</span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-400">
                <Flame className="h-4 w-4" aria-hidden="true" />
                12 day streak
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                { name: "Instagram", mins: "48 min", pct: 72 },
                { name: "TikTok", mins: "31 min", pct: 48 },
                { name: "Youtube", mins: "22 min", pct: 34 },
              ].map((row) => (
                <div key={row.name}>
                  <div className="flex justify-between text-sm text-gray-200">
                    <span>{row.name}</span>
                    <span className="text-gray-400">{row.mins}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-400">
              Still under your goals today. Nice.
            </p>
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how" className="border-t border-white/10 bg-[#2b2a36] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            The whole thing takes a minute a day.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-300">
            Three steps, repeated. That&apos;s how habits are built.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, step, title, body }) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-[#33313f] p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15">
                    <Icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <span className="text-2xl font-bold text-white/15">{step}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-gray-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Closing CTA ---- */}
      <section className="border-t border-white/10 bg-[#26252F] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Ready to take your time back?
          </h2>
          <p className="mt-4 text-gray-300">
            Start your streak today. It takes less than a minute.
          </p>
          <Link href="/auth/signup" className="mt-8 inline-block">
            <Button size="lg" className="px-10 text-base font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#26252F] px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-gray-400 sm:flex-row">
          <span>HabiTapp - Your habits in an app, one tap at a time.</span>
          <div className="flex items-center gap-5">
            <Link href="/auth/login" className="transition-colors hover:text-white">
              Log in
            </Link>
            <Link href="/auth/signup" className="transition-colors hover:text-white">
              Get Started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
