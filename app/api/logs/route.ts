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

    // Verify user exists first
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create the log with string-based wasProductive
    const log = await prisma.socialMediaLog.create({
      data: {
        logDate: new Date(logDate),
        duration: Number(duration),
        mood,
        activity,
        wasProductive, // Directly use the string value ('yes'/'no')
        habit: {
          connectOrCreate: {
            where: {
              platform_userId: {
                platform,
                userId
              }
            },
            create: {
              platform,
              user: { connect: { id: userId } },
              icon: getDefaultIcon(platform),
              goalDuration: 60
            }
          }
        }
      },
      include: {
        habit: true
      }
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
    'Instagram': '/icons/instagram.png',
    'Facebook': '/icons/facebook.png',
    'Twitter': '/icons/twitter.png',
    'TikTok': '/icons/tiktok.png',
    'LinkedIn': '/icons/linkedin.png'
  };
  return icons[platform] || '/icons/default.png';
}