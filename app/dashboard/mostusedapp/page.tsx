import React from 'react';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getPlatformUsage, getTotalMinutes, formatDuration } from '@/lib/usage';
import { getPlatformIconPath } from '@/lib/platforms';
import { PageHeader } from '@/components/page-header';

const Insights = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: { habit: true }
  });

  const sortedPlatforms = getPlatformUsage(logs);
  const totalMinutes = getTotalMinutes(logs);
  const top = sortedPlatforms[0]?.duration || 0;

  return (
    <section className="general">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-16">
        <PageHeader
          title="Insights"
          subtitle="Where your time actually goes, ranked by platform."
        />

        <div className="panel flex flex-col items-center py-8">
          <span className="text-sm font-medium text-gray-400">Total time logged</span>
          <span className="mt-1 text-4xl font-bold text-white">
            {formatDuration(totalMinutes)}
          </span>
          <span className="mt-1 text-sm text-gray-400">
            across {sortedPlatforms.length} {sortedPlatforms.length === 1 ? 'platform' : 'platforms'}
          </span>
        </div>

        <div className="panel flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-white">By platform</h2>

          {sortedPlatforms.length === 0 ? (
            <p className="py-6 text-center text-gray-400">
              No logs yet - add one on the tracker to see this fill up.
            </p>
          ) : (
            sortedPlatforms.map(({ platform, duration }) => {
              const pct = top > 0 ? Math.round((duration / top) * 100) : 0;
              const share = totalMinutes > 0 ? Math.round((duration / totalMinutes) * 100) : 0;
              return (
                <div key={platform} className="flex items-center gap-4">
                  <Image
                    src={getPlatformIconPath(platform)}
                    alt=""
                    width={28}
                    height={28}
                    className="shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-white">{platform}</span>
                      <span className="shrink-0 text-gray-400">
                        {formatDuration(duration)} · {share}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Insights;
