// app/api/account/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

// Permanently delete the signed-in user and everything they own.
export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
  }

  const userId = session.user.id;

  // No cascades in the schema, so we tear it down in dependency order.
  await prisma.$transaction([
    prisma.socialMediaLog.deleteMany({ where: { habit: { userId } } }),
    prisma.socialMediaHabit.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ ok: true });
}
