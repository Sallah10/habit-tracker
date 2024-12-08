"use client"
import Image from "next/image";
import bgImage from "/app/assets/BG Habit 2.png"
import { Button } from "@/components/ui/button";
import Hero from "./hero"

export default function Home() {
  return (
    <>
      <div className="mx-auto px-6 gap-2 md:gap-24 flex flex-col items-center relative min-h-screen w-full">
        <Image
          src={bgImage}
          alt="Background"
          quality={100}
          priority
          className="absolute z-[-1] object-cover w-full h-full"
        />
        <Hero/>
        <div  className="mt-64 mx-auto flex self-center">
          <a href="/login"><Button className="p-8 text-xl md:mb-48"> Get Started</Button></a>
        </div>
      </div>
    </>
  );
}
