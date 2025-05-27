// app/api/logs/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { logDate, platform, duration, mood, activity, wasProductive, userId } = await req.json();

    // Validate required fields
    if (!userId || !platform || !logDate) {
      return NextResponse.json(
        { error: "Missing required fields (userId, platform, logDate)" },
        { status: 400 }
      );
    }

    const log = await prisma.socialMediaLog.create({
      data: {
        logDate: new Date(logDate).toISOString(),
        duration: parseInt(duration),
        mood,
        activity,
        wasProductive: (wasProductive === 'true' || wasProductive === true).toString(),
        habit: {
          connectOrCreate: {
            where: {
              platform_userId: {
                platform,
                userId,
              },
            },
            create: {
              platform,
              userId,
              icon: getDefaultIcon(platform), // Implement this
              goalDuration: 60, // Default 60 minutes
            },
          },
        },
      },
      include: {
        habit: true,
      },
    });

    return NextResponse.json(log);
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
    // Add other platforms
  };
  return icons[platform] || '/default/social.png';
}