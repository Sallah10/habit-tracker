'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

type PlatformUsage = {
  platform: string;
  duration: number;
  icon: string;
};

// I pulled this out of page.tsx so the focus page can be a server component
// and FocusMode can be reused. Pages can't take custom props in the App Router.
const FocusMode = ({ platformData = [] }: { platformData?: PlatformUsage[] }) => {
  const [focusMode, setFocusMode] = useState(false);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [sessionDuration, setSessionDuration] = useState(25); // Default 25 mins
  const [secondsLeft, setSecondsLeft] = useState(0);
  const isRunning = secondsLeft > 0;

  const apps = platformData.map(item => ({
    id: item.platform.toLowerCase(),
    name: item.platform,
    icon: item.icon,
    usage: item.duration
  }));

  // Countdown for the actual focus session
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const startSession = () => {
    setSecondsLeft(sessionDuration * 60);
  };

  const stopSession = () => {
    setSecondsLeft(0);
  };

  const toggleApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const getFallbackIcon = (platform: string) => {
    const fallbackIcons: Record<string, string> = {
      instagram: '/default/instagram.png',
      twitter: '/default/tweeter.png',
      tiktok: '/default/tiktok.png',
      facebook: '/default/facebook.png',
      snapchat: '/default/snapchat.png',
      discord: '/default/discord.png',
      youtube: '/default/youtube.png'
    };
    return fallbackIcons[platform.toLowerCase()] || '/default/social.png';
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="panel w-full max-w-4xl mx-auto mb-10">
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
            animate={{ opacity: 1, height: 'auto' }}
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
                  disabled={isRunning}
                  className="w-full max-w-xs accent-brand"
                />
                <span className="text-xl font-medium mt-2">
                  {sessionDuration} minutes
                </span>
              </motion.div>

              {/* App Selection */}
              <div>
                <h2 className="text-xl mb-4 text-center">
                  Pick the apps you want to stay off:
                </h2>
                {apps.length === 0 ? (
                  <p className="text-center text-gray-300">
                    Log some social media usage first and your apps will show up here.
                  </p>
                ) : (
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
                        onClick={() => !isRunning && toggleApp(app.id)}
                        className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all border ${selectedApps.includes(app.id)
                          ? 'bg-brand/20 border-brand/60 shadow-inner'
                          : 'bg-white/[0.06] border-white/10 hover:bg-white/10 shadow-md'
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
                        <span className="text-xs text-gray-400 mt-1">
                          {Math.floor(app.usage / 60)}h {app.usage % 60}m
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Session controls */}
              <motion.div
                className="flex flex-col items-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isRunning && (
                  <motion.h2
                    key={clock}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold tabular-nums"
                  >
                    {clock}
                  </motion.h2>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {isRunning ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopSession}
                      className="px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold shadow-lg"
                    >
                      Stop Session
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startSession}
                      disabled={selectedApps.length === 0}
                      className={`px-6 py-3 rounded-full text-lg font-semibold shadow-lg ${selectedApps.length === 0
                        ? 'bg-gray-600 cursor-not-allowed text-white'
                        : 'bg-brand text-[#26252F]'
                        }`}
                    >
                      Start Focus Session
                    </motion.button>
                  )}
                </div>

                {isRunning && (
                  <p className="text-sm text-gray-400">
                    Staying off {selectedApps.length} app{selectedApps.length === 1 ? '' : 's'} until the timer ends
                  </p>
                )}
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
              Commit to a focused stretch without your distracting apps
            </motion.p>
            <motion.p className="text-gray-400">
              It&apos;s a countdown to keep you honest - it doesn&apos;t block apps
              on your device.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
