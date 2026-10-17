// app/api/habits/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

// PATCH daily goals for the user's habits.
// Body: { goals: [{ id, goalDuration }, ...] }
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const goals = body?.goals;

  if (!Array.isArray(goals)) {
    return NextResponse.json({ error: 'Expected a list of goals' }, { status: 400 });
  }

  const userId = session.user.id;

  // Only ever touch habits that belong to this user.
  const owned = await prisma.socialMediaHabit.findMany({
    where: { userId },
    select: { id: true },
  });
  const ownedIds = new Set(owned.map((h) => h.id));

  const updates = goals
    .filter((g: unknown): g is { id: string; goalDuration: number } => {
      if (typeof g !== 'object' || g === null) return false;
      const item = g as { id?: unknown };
      return typeof item.id === 'string' && ownedIds.has(item.id);
    })
    .map((g: { id: string; goalDuration: number }) =>
      prisma.socialMediaHabit.update({
        where: { id: g.id },
        data: {
          goalDuration: Math.max(5, Math.min(600, Number(g.goalDuration) || 60)),
        },
      })
    );

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No valid goals to update' }, { status: 400 });
  }

  await prisma.$transaction(updates);

  return NextResponse.json({ ok: true, count: updates.length });
}
