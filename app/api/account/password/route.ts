// app/api/account/password/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

// Change the password, or set one for Google-only accounts that never had one.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  // If they already have a password, they must prove they know it.
  if (user.password) {
    if (
      typeof currentPassword !== 'string' ||
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from the current one' },
        { status: 400 }
      );
    }
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ ok: true, hadPassword: Boolean(user.password) });
}
