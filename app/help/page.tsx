import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Help - HabiTapp" };

// The plain-English glossary. Everything here is honest about what the app
// actually does - no "blocks your apps" claims that aren't true.
const topics = [
  {
    id: "logging",
    term: "Logging",
    body: "You record how many minutes you spent on an app, plus a mood and what you were doing. It takes about ten seconds. Nothing is tracked automatically - HabiTapp only knows what you type in.",
  },
  {
    id: "goals",
    term: "Daily goals",
    body: "For each app you track, you set a number of minutes you want to stay under. Your dashboard adds up today's logs and compares the total to the sum of your goals.",
  },
  {
    id: "streak",
    term: "Streak",
    body: "A streak counts consecutive days (in UTC) where you logged at least one thing. Miss a day and it resets. It's a nudge to show up daily, nothing more.",
  },
  {
    id: "insights",
    term: "Insights",
    body: "Insights ranks the apps you logged this period by total time, so you can see where the hours actually went - not where you assume they went.",
  },
  {
    id: "focus",
    term: "Focus Mode",
    body: "A countdown timer for a focused stretch. You pick the apps you want to stay off and run the timer. It does NOT block apps on your device - it's a commitment device to keep you honest.",
  },
  {
    id: "winddown",
    term: "Wind Down",
    body: "A plan for the end of your day: a quiet window, plus optional greyscale and do-not-disturb intentions. It's a reminder of the routine you set, not an enforced schedule.",
  },
  {
    id: "privacy",
    term: "Privacy",
    body: "HabiTapp connects to nothing. No screen-time permissions, no linked accounts, no background access. The only data stored is what you enter yourself - so there's nothing to leak.",
  },
  {
    id: "pwa",
    term: "Using it as an app",
    body: "HabiTapp is a progressive web app. On Android: menu then Add to Home screen. On iPhone: Share, then Add to Home Screen. On desktop: the install icon in the address bar.",
  },
];

export default function HelpPage() {
  return (
    <section className="general">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-16">
        <PageHeader
          title="How HabiTapp works"
          subtitle="The vocabulary, in plain English."
          backHref="/dashboard"
          backLabel="Home"
        />

        <div className="flex flex-col gap-4">
          {topics.map((topic) => (
            <article key={topic.id} id={topic.id} className="panel scroll-mt-24">
              <h2 className="text-xl font-semibold text-white">{topic.term}</h2>
              <p className="mt-2 text-gray-300">{topic.body}</p>
            </article>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          Still stuck?{" "}
          <Link href="/dashboard" className="font-medium text-brand hover:underline">
            Head back to your dashboard
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
