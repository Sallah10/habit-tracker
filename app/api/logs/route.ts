// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
            where: { platformUserId: { platform, userId } },
            create: { platform, userId },
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