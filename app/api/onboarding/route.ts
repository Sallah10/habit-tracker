// app/api/onboarding/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { getPlatformIconPath } from '@/lib/platforms';

// Saves the platforms + goals a user picked during onboarding as their habits.
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
    }

    const { habits } = await req.json();

    if (!Array.isArray(habits) || habits.length === 0) {
      return NextResponse.json(
        { error: 'Pick at least one platform to track' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Keep only sane entries - never trust the shape coming from the client.
    const cleaned = habits
      .filter((h: unknown): h is { platform: string; goalDuration: number } => {
        if (typeof h !== 'object' || h === null) return false;
        const item = h as { platform?: unknown; goalDuration?: unknown };
        return typeof item.platform === 'string' && item.platform.length > 0;
      })
      .map((h: { platform: string; goalDuration: number }) => ({
        platform: h.platform,
        goalDuration: Math.max(
          5,
          Math.min(600, Number(h.goalDuration) || 60)
        ),
      }));

    if (cleaned.length === 0) {
      return NextResponse.json(
        { error: 'Pick at least one platform to track' },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      cleaned.map((h: { platform: string; goalDuration: number }) =>
        prisma.socialMediaHabit.upsert({
          where: { platform_userId: { platform: h.platform, userId } },
          create: {
            platform: h.platform,
            userId,
            icon: getPlatformIconPath(h.platform),
            goalDuration: h.goalDuration,
          },
          update: { goalDuration: h.goalDuration },
        })
      )
    );

    return NextResponse.json({ ok: true, count: cleaned.length }, { status: 201 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save your setup' }, { status: 500 });
  }
}

// Lets the dashboard know whether a user still needs to onboard.
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hasHabits: false }, { status: 401 });
  }

  const count = await prisma.socialMediaHabit.count({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ hasHabits: count > 0 });
}
