// app/dashboard/page.tsx
import React from 'react'
// import Hero from "../hero"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';
import AnimatedDashboard from "../AnimatedDashboard/page";
import { ChartData, PlatformData, DailyData } from "@/types/chart";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: { habit: true },
    orderBy: { logDate: 'asc' }
  });

  const chartData: ChartData = {
    daily: [],
    platforms: []
  };

  try {
    // Transform daily data
    chartData.daily = logs.reduce((acc: DailyData[], log) => {
      const date = log.logDate.toISOString().split('T')[0];
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.total += log.duration;
      } else {
        acc.push({ name: date, total: log.duration });
      }
      return acc;
    }, []);

    // Transform platform data
    chartData.platforms = logs.reduce((acc: PlatformData[], log) => {
      const platformName = log.habit?.platform || "Unknown";
      const existing = acc.find(item => item.name === platformName);
      if (existing) {
        existing.total += log.duration;
      } else {
        acc.push({
          name: platformName,
          total: log.duration,
          desktop: log.duration * 0.6, // Example distribution
          mobile: log.duration * 0.4   // Example distribution
        });
      }
      return acc;
    }, []);
  } catch (error) {
    console.error("Error transforming chart data:", error);
  }

  const totalMinutes = logs.reduce((sum: number, log) => sum + log.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <>
      {/* <Hero /> */}
      <AnimatedDashboard
        chartData={chartData}
        hours={hours}
        minutes={minutes}
        name={session.user.name || "User"}
      />
    </>
  )
}

export default Dashboard