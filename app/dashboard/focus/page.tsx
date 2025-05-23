'use client';
// , useEffect 
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import Hero from '@/app/hero';

type PlatformData = {
  platform: string;
  duration: number;
  icon: string;
};

const FocusMode = ({ platformData = [] }: {
  platformData?: PlatformData[];
}) => {
  const [focusMode, setFocusMode] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [sessionDuration, setSessionDuration] = useState(25); // Default 25 mins

  // Process platform data from Used component
  const apps = (platformData || []).map(item => ({
    id: item.platform.toLowerCase(),
    name: item.platform,
    icon: item.icon,
    usage: item.duration
  }));

  const toggleApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };
  // Fallback icons if none provided
  const getFallbackIcon = (platform: string) => {
    // Add your default icon paths here
    const fallbackIcons: Record<string, string> = {
      'instagram': '/default/instagram.png',
      'twitter': '/default/twitter.png',
      'tiktok': '/default/tiktok.png',
      'facebook': '/default/facebook.png',
      'snapchat': '/default/snapchat.png',
      'discord': '/default/discord.png',
      'youtube': '/default/youtube.png',
      // Add more fallbacks as needed
    };
    return fallbackIcons[platform.toLowerCase()] || '/default/social.png';
  };
  return (
    <>
      <section className='general'>
        {/* <div className="bg-[#D9D9D9] rounded-lg gap-10 flex flex-col items-center px-4 py-6 mb-6 max-w-[500px] self-center">
          <div className="flex justify-between w-full items-center">
            <h1 className="text-2xl">Focus Mode</h1>
            <Switch
              checked={focusMode}
              onCheckedChange={() => setFocusMode(!focusMode)}
            />
          </div>
        </div> */}
        <Hero />
        <div className="w-full max-w-4xl mx-auto bg-[#D9D9D9] rounded-lg p-6 mb-10">
          {/* Header with toggle */}
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-2xl md:text-3xl font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              Focus Mode
            </motion.h1>
            <Switch
              checked={focusMode}
              onCheckedChange={() => setFocusMode(!focusMode)}
              className="scale-110 md:scale-125"
            />
          </div>

          <AnimatePresence>
            {focusMode ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <motion.div
                  className="space-y-8"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Duration Selector */}
                  <motion.div
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.01 }}
                  >
                    <label className="text-lg mb-2">Focus Duration (minutes)</label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(Number(e.target.value))}
                      className="w-full max-w-xs"
                    />
                    <span className="text-xl font-medium mt-2">
                      {sessionDuration} minutes
                    </span>
                  </motion.div>

                  {/* App Selection */}
                  <div>
                    <h2 className="text-xl mb-4 text-center">
                      Select apps to block during focus:
                    </h2>
                    <motion.div
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                      layout
                    >
                      {apps.map(app => (
                        <motion.div
                          key={app.id}
                          layout
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleApp(app.id)}
                          className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all ${selectedApps.includes(app.id)
                            ? 'bg-gray-400 shadow-inner'
                            : 'bg-gray-200 hover:bg-gray-300 shadow-md'
                            }`}
                        >
                          <div className="relative w-12 h-12 mb-2">
                            <Image
                              src={app.icon || getFallbackIcon(app.name)}
                              alt={app.name}
                              fill
                              className={`object-contain ${selectedApps.includes(app.id) ? 'opacity-60' : ''}`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getFallbackIcon(app.name);
                              }}
                            />
                          </div>
                          <span className="text-center font-medium">
                            {app.name}
                          </span>
                          <span className="text-xs text-gray-600 mt-1">
                            {Math.floor(app.usage / 60)}h {app.usage % 60}m
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-green-600 text-white rounded-full text-lg font-semibold shadow-lg"
                      disabled={selectedApps.length === 0}
                    >
                      Start Focus Session
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg"
                    >
                      Schedule Session
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p className="text-xl md:text-2xl mb-6">
                  Block distracting apps when you need to focus
                </motion.p>
                <motion.p className="text-gray-700">
                  Your most used apps will be suggested when enabled
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section >
    </>
  );
};
export default FocusMode;