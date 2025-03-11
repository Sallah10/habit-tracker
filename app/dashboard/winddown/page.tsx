'use client'
import React from 'react'
import Hero from "../../hero"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'
import date from "/app/assets/date.png"

const Wind = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [focusMode, setFocusMode] = React.useState(false)

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }
  return (
    <>
      <section className='general'>
        <Hero />
        <div className='bg-[#D9D9D9] rounded-lg gap-10 flex flex-col items-center px-4 py-6 mb-6 max-w-[500px] self-center'>
          <div className='flex justify-between w-full items-center'>
            <h1 className='text-2xl'> Wind Down </h1>
            <Switch
              checked={focusMode}
              onCheckedChange={toggleFocusMode} />
          </div>
          <div className='flex '>
            {focusMode ?
              <div className='flex flex-col gap-8 md:gap-16'>
                <div className='flex flex-col gap-4 md:flex-row md:justify-between md:px-10'>
                  <div className='flex justify-between md:flex-col'>
                    <h1 className='text-2xl self-center'>Start:</h1>
                    <p className='text-xl flex'>10:15 PM</p>
                  </div>
                  <div className='flex justify-between md:flex-col'>
                    <h1 className='text-2xl self-center'>End:</h1>
                    <p className='text-xl flex'>11:15 PM</p>
                  </div>
                </div>
                <div>
                  <Image src={date} alt='date' />
                </div>
                <div>
                  <div className='flex justify-between'>
                    <h1 className='text-2xl'> Do Not Disturb</h1>
                    <Switch />
                  </div>
                  <div className='flex justify-between'>
                    <h1 className='text-2xl'>Greyscale</h1>
                    <Switch />
                  </div>
                </div>
                <h1 className='text-xl text-center flex justify-center items-center'>Your schedule will start again when Wind Down is on</h1>
              </div>
              :
              <h1 className='text-xl text-center flex justify-center items-center my-24'>Your schedule will start again when Wind Down is on</h1>}
          </div>
        </div>
      </section>
    </>
  )
}

export default Wind