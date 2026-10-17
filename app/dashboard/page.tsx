// app/dashboard/page.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { Flame, Trophy, Clock, CalendarCheck, ArrowRight, Timer } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentStreak, getLongestStreak } from "@/lib/streaks";
import { formatDuration } from "@/lib/usage";
import { getPlatformIconPath } from "@/lib/platforms";
import { Component, DailyMinutes } from "../chart";
import { Button } from "@/components/ui/button";

const dayKey = (d: Date) => d.toISOString().split("T")[0];

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const habits = await prisma.socialMediaHabit.findMany({
    where: { userId },
    orderBy: { platform: "asc" },
  });

  // First run: nothing to show yet, so send them through setup.
  if (habits.length === 0) {
    redirect("/onboarding");
  }

  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId } },
    include: { habit: { select: { platform: true, goalDuration: true } } },
    orderBy: { logDate: "asc" },
  });

  const todayKey = dayKey(new Date());

  // Today's minutes, both total and per platform.
  const todayByPlatform = new Map<string, number>();
  let todayMinutes = 0;
  for (const log of logs) {
    if (dayKey(log.logDate) !== todayKey) continue;
    const platform = log.habit?.platform || "Unknown";
    todayByPlatform.set(platform, (todayByPlatform.get(platform) || 0) + log.duration);
    todayMinutes += log.duration;
  }

  const dailyGoal = habits.reduce((sum, h) => sum + (h.goalDuration ?? 60), 0);
  const goalProgress = dailyGoal > 0 ? Math.min(100, Math.round((todayMinutes / dailyGoal) * 100)) : 0;
  const overGoal = todayMinutes > dailyGoal;

  // Last 14 days of total minutes for the chart.
  const byDay = new Map<string, number>();
  for (const log of logs) {
    const key = dayKey(log.logDate);
    byDay.set(key, (byDay.get(key) || 0) + log.duration);
  }
  const last14: DailyMinutes[] = [];
  for (let i = 13; i >= 0; i -= 1) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = dayKey(d);
    last14.push({ date: key, minutes: byDay.get(key) || 0 });
  }

  const logDates = logs.map((log) => dayKey(log.logDate));
  const currentStreak = getCurrentStreak(logDates);
  const longestStreak = getLongestStreak(logDates);
  const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0);
  const daysTracked = new Set(logDates).size;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = session.user.name?.split(" ")[0] || "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const stats = [
    { icon: Flame, label: "Current streak", value: `${currentStreak}`, unit: currentStreak === 1 ? "day" : "days", accent: true },
    { icon: Trophy, label: "Best streak", value: `${longestStreak}`, unit: longestStreak === 1 ? "day" : "days" },
    { icon: Clock, label: "All-time logged", value: formatDuration(totalMinutes), unit: "" },
    { icon: CalendarCheck, label: "Days tracked", value: `${daysTracked}`, unit: "" },
  ];

  return (
    <section className="general text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-16">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            {greeting}, {firstName}.
          </h1>
          <p className="mt-1 text-gray-400">{todayLabel}</p>
        </div>

        {/* Today card */}
        <div className="panel flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Timer className="h-4 w-4 text-brand" aria-hidden="true" />
              Today so far
            </div>
            <p className="mt-2 text-4xl font-bold">
              {formatDuration(todayMinutes)}
              <span className="ml-2 text-lg font-normal text-gray-400">
                / {formatDuration(dailyGoal)} goal
              </span>
            </p>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${overGoal ? "bg-red-400" : "bg-brand"}`}
                style={{ width: `${goalProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              {overGoal
                ? `Over your goal by ${formatDuration(todayMinutes - dailyGoal)}. Tomorrow's a fresh start.`
                : todayMinutes > 0
                ? "You're under your goal today. Nice."
                : "Nothing logged yet - start your day."}
            </p>
          </div>
          <Link href="/tracker" className="shrink-0">
            <Button size="lg" className="w-full gap-2 px-6 text-base font-semibold md:w-auto">
              Log today <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, unit, accent }) => (
            <div key={label} className="panel flex flex-col gap-1 p-4">
              <Icon className={`h-5 w-5 ${accent ? "text-brand" : "text-gray-400"}`} aria-hidden="true" />
              <span className="mt-1 text-2xl font-bold">
                {value}
                {unit ? <span className="ml-1 text-sm font-normal text-gray-400">{unit}</span> : null}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Today by platform */}
        <div className="panel">
          <h2 className="text-xl font-semibold">Tracked apps</h2>
          <div className="mt-4 flex flex-col gap-4">
            {habits.map((habit) => {
              const goal = habit.goalDuration ?? 60;
              const used = todayByPlatform.get(habit.platform) || 0;
              const pct = goal > 0 ? Math.min(100, Math.round((used / goal) * 100)) : 0;
              const over = used > goal;
              return (
                <div key={habit.id} className="flex items-center gap-4">
                  <Image
                    src={getPlatformIconPath(habit.platform)}
                    alt=""
                    width={28}
                    height={28}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium">{habit.platform}</span>
                      <span className={`shrink-0 ${over ? "text-red-400" : "text-gray-400"}`}>
                        {formatDuration(used)} / {formatDuration(goal)}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${over ? "bg-red-400" : "bg-brand"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend */}
        <div className="panel">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Last 14 days</h2>
            <Link href="/dashboard/mostusedapp" className="text-sm text-brand hover:underline">
              See insights
            </Link>
          </div>
          <div className="mt-4">
            <Component data={last14} goal={dailyGoal} />
          </div>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/focus"
            className="panel flex items-center justify-between transition-colors hover:border-brand/40"
          >
            <div>
              <p className="font-semibold">Focus Mode</p>
              <p className="mt-1 text-sm text-gray-400">Run a countdown focus session.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand" aria-hidden="true" />
          </Link>
          <Link
            href="/dashboard/mostusedapp"
            className="panel flex items-center justify-between transition-colors hover:border-brand/40"
          >
            <div>
              <p className="font-semibold">Insights</p>
              <p className="mt-1 text-sm text-gray-400">Where your time actually goes.</p>
            </div>
            <ArrowRight className="h-5 w-5 text-brand" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
