// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { logDate, platform, duration, mood, activity, wasProductive, userId } = await req.json();

  try {
    const log = await prisma.socialMediaLog.create({
      data: {
        logDate: new Date(logDate),
        duration,
        mood,
        activity,
        wasProductive,
        habit: {
          connectOrCreate: {
            where: {
              platform_userId: { // Use the composite unique key
                platform,
                userId,
              },
            },
            create: {
              platform,
              userId,
              icon: '', // Add a default icon or leave it empty
              goalDuration: 0, // Add a default goal duration or leave it as 0
            },
          },
        },
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}