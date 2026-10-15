import React from 'react';
import Hero from '../../hero';
import Image, { StaticImageData } from 'next/image';
import icon1 from '/app/assets/ContainerIcon.png';
import icon2 from '/app/assets/ContainerIcon-1.png';
import icon3 from '/app/assets/ContainerIcon-2.png';
import icon4 from '/app/assets/ContainerIcon-3.png';
import icon5 from '/app/assets/ContainerIcon-5.png';
import icon6 from '/app/assets/ContainerIcon-6.png';
import icon7 from '/app/assets/ContainerIcon-7.png';
import icon8 from '/app/assets/ContainerIcon-8.png';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getPlatformUsage, getTotalMinutes, formatDuration } from '@/lib/usage';

const Used = async () => {
  const session = await getServerSession(authOptions);

  // Redirect to login if no session exists
  if (!session) {
    redirect('/auth/login');
  }

  // Fetch logs for the current user
  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: { habit: true }
  });

  const sortedPlatforms = getPlatformUsage(logs);
  const totalMinutes = getTotalMinutes(logs);

  function getPlatformIcon(platform: string): StaticImageData {
    const icons: Record<string, StaticImageData> = {
      Discord: icon1,
      TikTok: icon2,
      Twitter: icon3,
      Snapchat: icon4,
      Instagram: icon5,
      Chrome: icon6,
      Youtube: icon7,
      Facebook: icon8
    };
    return icons[platform] || icons['Discord'];
  }

  return (
    <>
      <section className="general p-4">
        <Hero />
        <div className="panel flex flex-col gap-4 mb-10">
          <h1 className="text-2xl self-center flex">Most Used Apps:</h1>
          {sortedPlatforms.length === 0 ? (
            <p className="text-center">No logs yet - add one on the tracker to see this fill up.</p>
          ) : (
            <div className="gap-4 grid-cols-1 items-center grid lg:grid-cols-3 md:grid-cols-2">
              {sortedPlatforms.map(({ platform, duration }) => (
                <div key={platform} className="flex flex-col gap-4 pb-3 justify-center sm:border-b-4 md:border-none border-white/10">
                  <div className="socials">
                    <Image src={getPlatformIcon(platform)} alt={platform} />
                    <div>
                      <h1 className="text-xl">{platform}</h1>
                      <p>{formatDuration(duration)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="panel flex flex-col gap-4 mb-10">
          <h1 className="text-2xl self-center flex">Total Time Spent:</h1>
          <div className="text-center">
            <h1 className="text-xl">{formatDuration(totalMinutes)}</h1>
          </div>
        </div>
      </section>
    </>
  );
};

export default Used;
