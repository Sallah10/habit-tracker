// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { logDate, platform, duration, mood, activity, wasProductive, userId } = await req.json();

    // 1. Validate required fields
    if (!userId || !platform || !logDate) {
      return NextResponse.json(
        { error: "Missing required fields (userId, platform, logDate)" },
        { status: 400 }
      );
    }

    // 2. Verify user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 3. Create in transaction to ensure data consistency
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
          userId,  // Directly assign userId
          icon: getDefaultIcon(platform),
          goalDuration: 60
        },
        update: {} // No updates needed if exists
      });

      // Then create the log
      return await tx.socialMediaLog.create({
        data: {
          logDate: new Date(logDate),
          duration: Number(duration),
          mood,
          activity,
          wasProductive,
          habitId: habit.id  // Directly connect using habitId
        },
        include: {
          habit: true
        }
      });
    });
// console.log('Session user ID:', session?.user?.id);
console.log('User from DB:', user);
    return NextResponse.json(result);

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

function getDefaultIcon(platform: string): string {
  const icons: Record<string, string> = {
    Instagram: '/default/instagram.png',
    Facebook: '/default/facebook.png',
    Twitter: '/default/tweeter.png',
    TikTok: '/default/tiktok.png',
    Youtube: '/default/youtube.png',
    Snapchat: '/default/snapchat.png',
    Discord: '/default/discord.png',
    // Add other platforms
  };
  return icons[platform] || '/default/social.png';
}

