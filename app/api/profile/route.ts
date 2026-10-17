// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

// GET the bits of the profile the settings page needs.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    // Never send the hash - just whether one exists.
    hasPassword: Boolean(user.password),
  });
}

// PATCH the display name.
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'You must be signed in' }, { status: 401 });
  }

  const { name } = await req.json();
  const clean = typeof name === 'string' ? name.trim() : '';

  if (clean.length < 1 || clean.length > 60) {
    return NextResponse.json(
      { error: 'Please enter a name between 1 and 60 characters' },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: clean },
  });

  return NextResponse.json({ ok: true, name: clean });
}
