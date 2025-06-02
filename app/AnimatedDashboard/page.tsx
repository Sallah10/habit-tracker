// app/components/AnimatedDashboard.tsx
"use client";

import { motion } from "framer-motion";
import { Component } from "../chart";
import { HabitData } from "@/types/chart";
// import Hero from "../hero"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

interface AnimatedDashboardProps {
  chartData: HabitData[];
  hours: number;
  minutes: number;
  name: string;
}

export default function AnimatedDashboard({
  chartData,
  hours,
  minutes,
  name
}: AnimatedDashboardProps) {
  if (!chartData || !Array.isArray(chartData)) {
    console.error("Invalid chartData structure:", chartData);
    return (
      <div className="text-white p-4">
        <h1>Dashboard</h1>
        <p>Chart data is not available at the moment.</p>
      </div>
    );
  }
  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={container}
      className='general text-white'
    >
      {/* <Hero /> */}
      <div className='flex flex-col gap-6 justify-between items-center'>
        <motion.h1 variants={item} className='text-3xl'>Dashboard</motion.h1>
        <motion.p variants={item}>Welcome, {name}</motion.p>

        <motion.a
          href="tracker"
          className='text-3xl text-gray-300 underline'
          variants={item}
          whileHover={{
            scale: 1.05,
            color: "#3b82f6"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Tracker
        </motion.a>

        <motion.div
          variants={item}
          className='flex border-8 rounded-full items-center justify-center h-[300px] w-[300px] text-lg'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
        >
          <motion.h1
            key={`${hours}-${minutes}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {hours}h {minutes}m
          </motion.h1>
        </motion.div>

        <motion.div
          className='text-white flex flex-col justify-center items-center gap-4'
          variants={container}
        >
          {[
            { href: "/dashboard/winddown", text: "Wind Down", subtext: "off" },
            { href: "/dashboard/focus", text: "Focus Mode", subtext: "off" },
            { href: "/dashboard/mostusedapp", text: "Most Used Apps" }
          ].map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              variants={item}
              whileHover={{ x: 5 }}
              className="group"
            >
              <h1 className="text-2xl group-hover:text-blue-300">{link.text}</h1>
              {link.subtext && (
                <motion.small
                  className="items-center justify-center flex"
                  whileHover={{ scale: 1.1 }}
                >
                  {link.subtext}
                </motion.small>
              )}
            </motion.a>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Component data={chartData} />
      </motion.div>
    </motion.section>
  );
}