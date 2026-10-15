import Image from "next/image";
import Link from "next/link";
import { Flame, LineChart, TimerReset } from "lucide-react";
import bgImage from "/app/assets/BGHabit2.png";
import logo from "/app/assets/HabiTapp.png";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TimerReset,
    title: "Log it in seconds",
    body: "Pick a platform, add the minutes, set your mood. That's the whole ritual.",
  },
  {
    icon: LineChart,
    title: "See the pattern",
    body: "Charts and totals turn scattered scrolling into something you can actually read.",
  },
  {
    icon: Flame,
    title: "Keep the streak",
    body: "Log a little every day and watch your streak grow. Miss a day and it resets.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden">
      <Image
        src={bgImage}
        alt=""
        quality={100}
        priority
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#26252F]" />

      <div className="relative z-10 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Image src={logo} alt="HabiTapp" width={260} height={96} priority />

        <h1 className="mt-8 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Take your time back.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-200">
          HabiTapp shows you where your scrolling goes, so you can build better
          habits one day - and one tap - at a time.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/auth/signup">
            <Button size="lg" className="w-full px-8 text-base sm:w-auto">
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

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-[#33313f] p-6 text-left"
            >
              <Icon className="h-6 w-6 text-blue-300" />
              <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-gray-300">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
