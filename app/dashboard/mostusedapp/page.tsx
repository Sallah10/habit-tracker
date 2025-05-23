import React from 'react';
import Hero from '../../hero';
import Image, { StaticImageData } from 'next/image';
import icon1 from '/app/assets/ContainerIcon.png';
import icon2 from '/app/assets/ContainerIcon-1.png';
import icon3 from '/app/assets/ContainerIcon-2.png';
import icon4 from '/app/assets/ContainerIcon-3.png';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import FocusMode from '../focus/page';

const Used = async () => {
  const session = await getServerSession(authOptions);

  // Redirect to login if no session exists
  if (!session) {
    redirect('/auth/login');
  }

  // Fetch logs for the current user
  const logs = await prisma.socialMediaLog.findMany({
    where: { habit: { userId: session.user.id } },
    include: { habit: true },
  });

  // Calculate total time spent per platform
  const platformUsage = logs.reduce((acc, log) => {
    const platform = log.habit?.platform || 'Unknown';
    if (!acc[platform]) {
      acc[platform] = 0;
    }
    acc[platform] += log.duration;
    return acc;
  }, {} as Record<string, number>);

  // Convert platformUsage to an array and sort by duration
  const sortedPlatforms = Object.entries(platformUsage)
    .map(([platform, duration]) => ({ platform, duration }))
    .sort((a, b) => b.duration - a.duration);

  // Calculate total time spent
  const totalMinutes = Object.values(platformUsage).reduce((sum, duration) => sum + duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  function getPlatformIcon(platform: string) {
    const icons: Record<string, StaticImageData> = {
      'Discord': icon1,
      'TikTok': icon2,
      'Twitter': icon3,
      'Snapchat': icon4,
      // 'Instagram': icon5,
      // Add more mappings
    };
    return icons[platform] || icons['Discord']; // Default fallback
  }

  return (
    <>
      <section className="general p-4">
        <Hero />
        <div className="bg-[#D9D9D9] rounded-lg flex flex-col gap-4 px-4 py-6 mb-10">
          <h1 className="text-2xl self-center flex">Most Used Apps:</h1>
          <div className="gap-4 grid-cols-1 items-center grid lg:grid-cols-3 md:grid-cols-2">
            {sortedPlatforms.map(({ platform, duration }, index) => {
              const platformHours = Math.floor(duration / 60);
              const platformMinutes = duration % 60;
              return (
                <div key={index} className="flex flex-col gap-4 pb-3 justify-center sm:border-b-4 md:border-none border-gray-900">
                  <div className="socials">
                    <Image
                      src={
                        platform === 'Discord'
                          ? icon1
                          : platform === 'TikTok'
                            ? icon2
                            : platform === 'Twitter'
                              ? icon3
                              : platform === 'snapchat'
                                ? icon4
                                : ''
                      }
                      alt={platform}
                    />
                    <div>
                      <h1 className="text-xl">{platform}</h1>
                      <p>
                        {platformHours > 0 ? `${platformHours}h ` : ''}
                        {platformMinutes}m
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#D9D9D9] rounded-lg flex flex-col gap-4 px-4 py-6 mb-10">
          <h1 className="text-2xl self-center flex">Total Time Spent:</h1>
          <div className="text-center">
            <h1 className="text-xl">
              {hours}h {minutes}m
            </h1>
          </div>
        </div>
        {/* // Add this to your Used component's return: */}
        <div className='hidden w-0 h-0'>
          <FocusMode platformData={sortedPlatforms.map(platform => ({
            platform: platform.platform,
            duration: platform.duration,
            icon: getPlatformIcon(platform.platform).src
          }))} />
        </div>
      </section>
    </>
  );
};

export default Used;