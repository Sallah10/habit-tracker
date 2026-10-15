'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/page-header';

const Wind = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [doNotDisturb, setDoNotDisturb] = React.useState(false);
  const [greyscale, setGreyscale] = React.useState(false);

  return (
    <section className="general items-center">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-16">
        <PageHeader
          title="Wind Down"
          subtitle="Schedule a nightly digital detox."
          backHref="/dashboard/focus"
          backLabel="Focus"
        />

        <div className="panel flex flex-col gap-8">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15">
                <Moon className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white">Enable Wind Down</h2>
                <p className="text-sm text-gray-400">A quiet window at the end of the day.</p>
              </div>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <AnimatePresence initial={false}>
            {enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                    <div className="flex-1">
                      <label htmlFor="wind-start" className="label">
                        Start
                      </label>
                      <input
                        id="wind-start"
                        type="time"
                        defaultValue="22:15"
                        className="field"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="wind-end" className="label">
                        End
                      </label>
                      <input
                        id="wind-end"
                        type="time"
                        defaultValue="23:15"
                        className="field"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Do Not Disturb</span>
                      <Switch
                        checked={doNotDisturb}
                        onCheckedChange={setDoNotDisturb}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Greyscale</span>
                      <Switch checked={greyscale} onCheckedChange={setGreyscale} />
                    </div>
                  </div>

                  <p className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                    Your schedule will activate every night during this window.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!enabled && (
            <p className="py-8 text-center text-gray-400">
              Enable wind down to schedule your nightly digital detox.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Wind;
