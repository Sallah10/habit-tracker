import Image from "next/image";
// import logo from "/app/assets/HabiTapp.png"
import bgImage from "/app/assets/BG Habit 2.png"
import { Button } from "@/components/ui/button";
import Hero from "./hero"

export default function Home() {
  return (
    <>
    {/* style={{background-image: ""url('/app/BG Habit 2.png');"}} */}
    {/* <div 
      className="bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('C:\Users\DELL\Desktop\habit-tracker\app\BG Habit 2.png')`
      }}> */}
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
