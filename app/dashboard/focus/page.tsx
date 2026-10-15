// app/dashboard/focus/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';
import { getPlatformUsage } from '@/lib/usage';
import { getPlatformIconPath } from '@/lib/platforms';
import Link from 'next/link';
import { Moon, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
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
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-16">
        <PageHeader
          title="Focus Mode"
          subtitle="Block distracting apps and keep your attention where you want it."
        />
        <FocusMode platformData={platformData} />
        <Link
          href="/dashboard/winddown"
          className="panel flex items-center justify-between transition-colors hover:border-amber-400/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15">
              <Moon className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold text-white">Wind Down</p>
              <p className="text-sm text-gray-400">Schedule a nightly digital detox.</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default Focus;
