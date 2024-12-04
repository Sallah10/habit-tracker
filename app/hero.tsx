import Image from 'next/image'
import React from 'react'
import logo from "/app/assets/HabiTapp.png"


const Hero = () => {
  return (
    <div className='flex flex-col self-center'>
        <Image src={logo} alt="Logo" className=""/>
        <h2 className="text-white text-lg ">&quot;Your Habits in an App with just one Tap&quot;</h2>
    </div>
  )
}

export default Hero