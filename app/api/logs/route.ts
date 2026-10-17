// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { getPlatformIconPath } from '@/lib/platforms';

export async function GET() {
  try {
    // Always read the user from the session - never from the query string.
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to view logs' },
        { status: 401 }
      );
    }

    const logs = await prisma.socialMediaLog.findMany({
      where: {
        habit: {
          userId: session.user.id
        }
      },
      include: {
        habit: true
      },
      orderBy: {
        logDate: 'desc'
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to save logs' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { logDate, platform, duration, mood, activity, wasProductive } = await req.json();

    // 1. Validate required fields
    if (!platform || !logDate) {
      return NextResponse.json(
        { error: 'Missing required fields (platform, logDate)' },
        { status: 400 }
      );
    }

    const minutes = Number(duration);
    if (!Number.isFinite(minutes) || minutes < 0) {
      return NextResponse.json(
        { error: 'Duration must be a positive number of minutes' },
        { status: 400 }
      );
    }

    // Backfill only within the last 7 days. Block future dates.
    const now = new Date();
    const inputDate = new Date(logDate);
    if (Number.isNaN(inputDate.getTime())) {
      return NextResponse.json(
        { error: 'Please pick a valid date' },
        { status: 400 }
      );
    }

    const todayStartUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const inputStartUTC = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate()));

    if (inputStartUTC > todayStartUTC) {
      return NextResponse.json(
        { error: "You can't log a future date" },
        { status: 400 }
      );
    }

    const maxBack = new Date(todayStartUTC);
    maxBack.setUTCDate(maxBack.getUTCDate() - 6);
    if (inputStartUTC < maxBack) {
      return NextResponse.json(
        { error: 'You can only backfill up to 7 days back. Backfilling too far rewrites your streak' },
        { status: 400 }
      );
    }

    // 2. Create in transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // First find or create the habit
      const habit = await tx.socialMediaHabit.upsert({
        where: {
          platform_userId: {
            platform,
            userId
          }
        },
        create: {
          platform,
          userId,
          icon: getPlatformIconPath(platform),
          goalDuration: 60
        },
        update: {} // No updates needed if exists
      });

      // Then create the log
      return await tx.socialMediaLog.create({
        data: {
          logDate: new Date(logDate),
          duration: minutes,
          mood,
          activity,
          wasProductive: wasProductive === true || wasProductive === 'yes' ? 'yes' : 'no',
          habitId: habit.id
        },
        include: {
          habit: true
        }
      });
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create log',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    );
  }
}
