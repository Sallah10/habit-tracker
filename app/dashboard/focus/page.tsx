// app/dashboard/focus/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Hero from '@/app/hero';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { getPlatformUsage } from '@/lib/usage';
import { getPlatformIconPath } from '@/lib/platforms';
import FocusMode from './FocusMode';

const Focus = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Feed the user's real platforms into focus mode instead of passing them
  // through a hidden component like we used to.
  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: { habit: true }
  });

  const platformData = getPlatformUsage(logs).map(({ platform, duration }) => ({
    platform,
    duration,
    icon: getPlatformIconPath(platform)
  }));

  return (
    <section className="general">
      <Hero />
      <FocusMode platformData={platformData} />
    </section>
  );
};

export default Focus;
