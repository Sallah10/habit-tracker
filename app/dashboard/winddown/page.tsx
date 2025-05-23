'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import date from "/app/assets/date.png";

const Wind = () => {
  const [focusMode, setFocusMode] = React.useState(false);
  const [doNotDisturb, setDoNotDisturb] = React.useState(false);
  const [greyscale, setGreyscale] = React.useState(false);

  return (
    <div className="bg-[#D9D9D9] rounded-lg gap-10 flex flex-col items-center px-4 py-6 mb-6 max-w-[500px] self-center">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl">Wind Down</h1>
        <Switch
          checked={focusMode}
          onCheckedChange={() => setFocusMode(!focusMode)}
        />
      </div>

      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden"
          >
            <motion.div
              className="flex flex-col gap-8 md:gap-16"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Time Selection */}
              <motion.div
                className="flex flex-col gap-4 md:flex-row md:justify-between md:px-10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between md:flex-col">
                  <h1 className="text-2xl self-center">Start:</h1>
                  <input
                    type="time"
                    className="text-xl bg-transparent border-b border-gray-600"
                    defaultValue="22:15"
                  />
                </div>
                <div className="flex justify-between md:flex-col">
                  <h1 className="text-2xl self-center">End:</h1>
                  <input
                    type="time"
                    className="text-xl bg-transparent border-b border-gray-600"
                    defaultValue="23:15"
                  />
                </div>
              </motion.div>

              {/* Calendar Integration */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Image src={date} alt="date" className="mx-auto" />
              </motion.div>

              {/* Settings */}
              <motion.div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl">Do Not Disturb</h1>
                  <Switch
                    checked={doNotDisturb}
                    onCheckedChange={() => setDoNotDisturb(!doNotDisturb)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl">Greyscale</h1>
                  <Switch
                    checked={greyscale}
                    onCheckedChange={() => setGreyscale(!greyscale)}
                  />
                </div>
              </motion.div>

              <motion.p
                className="text-xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your schedule will activate during Wind Down
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!focusMode && (
        <motion.p
          className="text-xl text-center my-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Enable to schedule your nighttime digital detox
        </motion.p>
      )}
    </div>
  );
};

export default Wind