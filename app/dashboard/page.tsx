// app/dashboard/page.tsx
import React from 'react'
// import Hero from "../hero"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';
import AnimatedDashboard from "../AnimatedDashboard/page";
import { HabitData } from "@/types/chart";

const Dashboard = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch logs with related habit data
  const logs = await prisma.socialMediaLog.findMany({
    where: {
      habit: {
        userId: session.user.id
      }
    },
    include: {
      habit: {
        select: {
          platform: true,
          goalDuration: true
        }
      }
    },
    orderBy: {
      logDate: 'asc'
    }
  })

  // Transform to HabitData[] format matching your schema
  const habitData: HabitData[] = logs.map(log => ({
    date: log.logDate.toISOString().split('T')[0],
    completed: log.duration,
    total: log.habit?.goalDuration || 60, // Default to 60 mins if no goal set
    platform: {
      desktop: log.duration, // Using full duration since we don't have device split
      mobile: 0              // You might want to add device tracking to your schema
    },
    mood: log.mood || undefined,
    activity: log.activity || undefined,
    wasProductive: log.wasProductive === 'yes'
  }))

  // Calculate total usage time
  const totalMinutes = logs.reduce((sum, log) => sum + log.duration, 0)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return (
    <AnimatedDashboard
      chartData={habitData}
      hours={hours}
      minutes={minutes}
      name={session.user.name || "User"}
    />
  )
}

export default Dashboard