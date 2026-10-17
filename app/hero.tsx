import Image from 'next/image'
import React from 'react'
import logo from "/app/assets/HabiTapp.png"


const Hero = () => {
  return (
    <div className='flex flex-col self-center pt-4 md:pt-8'>
      <Image src={logo} alt="Logo" width={487} height={106} className="h-auto w-44 self-center sm:w-56" />
      <h2 className="text-white text-lg flex self-center">&quot;Your Habits in an App with just one Tap&quot;</h2>
    </div>
  )
}

export default Hero