import React from 'react'
import Hero from "../hero"
import { Component } from "../chart"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  // If no session exists, redirect to login
  if (!session) {
    redirect('/login');
  }

  // Fetch logs for the current user
  const logs = await prisma.socialMediaLog.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      date: 'asc'
    }
  });

  // Transform the data for charts
  const chartData = {
    daily: logs.reduce((acc: { name: string; total: number }[], log: { date: { toISOString: () => string; }; timeSpent: number; }) => {
      const date = log.date.toISOString().split('T')[0];
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.total += log.timeSpent;
      } else {
        acc.push({ name: date, total: log.timeSpent });
      }
      return acc;
    }, []),

    platforms: logs.reduce((acc: { name: string; total: number }[], log: { platform: string; timeSpent: number; }) => {
      const existing = acc.find(item => item.name === log.platform);
      if (existing) {
        existing.total += log.timeSpent;
      } else {
        acc.push({ name: log.platform, total: log.timeSpent });
      }
      return acc;
    }, [])
  };

  // Calculate total time spent
  const totalMinutes = logs.reduce((sum: number, log: { timeSpent: number }) => sum + log.timeSpent, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <>
      <section className='general'>
        <Hero />
        <div className='flex flex-col gap-6 justify-between items-center'>
          <h1 className='text-3xl'>Dashboard</h1>
          <p>Welcome, {session.user.name}</p>
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