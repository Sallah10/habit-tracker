// "use client";
import React from 'react'
import Hero from "../hero"
import { Component } from "../chart"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import prisma from '@/lib/prisma';



const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  // If no session exists, redirect to login
  if (!session) {
    redirect('/login');
  }

  // Fetch logs for the current user
  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: {
      habit: true, // Fetch related habit data
    },
    orderBy: {
      logDate: 'asc'
    }
  });

  // Transform the data for charts
  const chartData = {
    daily: logs.reduce((acc: { name: string; total: number }[], log) => {
      const date = log.logDate.toISOString().split('T')[0]; // Use logDate instead of date
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.total += log.duration; // Use duration instead of timeSpent
      } else {
        acc.push({ name: date, total: log.duration });
      }
      return acc;
    }, []),

    platforms: logs.reduce((acc: { name: string; total: number }[], log) => {
      const platformName = log.habit?.platform || "Unknown"; // Ensure platform exists
      const existing = acc.find(item => item.name === platformName);
      if (existing) {
        existing.total += log.duration;
      } else {
        acc.push({ name: platformName, total: log.duration });
      }
      return acc;
    }, [])
  };

  // Calculate total time spent
  const totalMinutes = logs.reduce((sum: number, log) => sum + log.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <>
      <section className='general text-white'>
        <Hero />
        <div className='flex flex-col gap-6 justify-between items-center'>
          <h1 className='text-3xl '>Dashboard</h1>
          <p>Welcome, {session.user.name}</p>
          <a href="tracker" className='text-3xl'>Tracker</a>
          <div className='flex border-8 rounded-full items-center justify-center h-[300px] w-[300px] text-lg text-white'>
            <h1>{hours}h {minutes}m</h1>
          </div>
          <div className='text-white flex flex-col justify-center items-center gap-4'>
            <a href="/dashboard/winddown">
              <h1 className='text-2xl'> Wind Down</h1>
              <small className='items-center justify-center flex'>off</small>
            </a>
            <a href="/dashboard/focus">
              <h1 className='text-2xl'> Focus Mode</h1>
              <small className='items-center justify-center flex'>off</small>
            </a>
            <a href="/dashboard/mostusedapp">
              <h1 className='text-2xl'> Most Used Apps</h1>
            </a>
          </div>
        </div>
        <Component data={chartData} />
      </section>
    </>
  )
}

export default Dashboard

{/* <section className='general'>
        <Hero />
        <div className='flex flex-col gap-6 justify-between items-center'>
          <h1 className='text-3xl'>Dashboard</h1>
          <p>Welcome, {session.user.name}</p>
          <div className=' flex border-8 rounded-full items-center justify-center h-[300px] w-[300px] text-lg text-white'>
            <h1>10h 23m</h1>
          </div>
          <div className='text-white flex flex-col justify-center items-center gap-4'>
            <a href="/dashboard/winddown"><h1 className='text-2xl'> Wind Down</h1><small className='items-center justify-center flex'>off</small></a>
            <a href="/dashboard/focus"><h1 className='text-2xl'> Focus Mode</h1> <small className='items-center justify-center flex'>off</small></a>
            <a href="/dashboard/mostusedapp"><h1 className='text-2xl'> Most Used Apps</h1></a>
          </div>
        </div>
        <Component />
      </section>
*/}