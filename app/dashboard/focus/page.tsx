'use client'
import React from 'react'
import Hero from "../../hero"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'
import icon5 from "/app/assets/ContainerIcon-5.png"
import icon6 from "/app/assets/ContainerIcon-6.png"
import icon7 from "/app/assets/ContainerIcon-7.png"


const Focus = () => {
  const [focusMode, setFocusMode] = React.useState(false)

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }
  return (
    <>
      <section className='general'>
        <Hero />
        <div className='bg-[#D9D9D9] rounded-lg gap-10 flex flex-col px-4 py-6 mb-10 self-center'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl'> Focus Mode </h1>
            <Switch
              checked={focusMode}
              onCheckedChange={toggleFocusMode} />
          </div>
          <div className='flex '>
            {focusMode ?
              <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 border-b-4 border-gray-600 pb-6'>
                  <Image src={icon5} alt='focusIcons' />
                  <Image src={icon6} alt='focusIcons' />
                  <Image src={icon7} alt='focusIcons' />
                  <Image src={icon5} alt='focusIcons' />
                  <Image src={icon6} alt='focusIcons' />
                  <Image src={icon7} alt='focusIcons' />
                  <Image src={icon5} alt='focusIcons' />
                  <Image src={icon6} alt='focusIcons' />
                  <Image src={icon7} alt='focusIcons' />
                  <Image src={icon5} alt='focusIcons' className='flex md:hidden lg:hidden' />
                </div>
                <h1 className='text-xl text-center flex justify-center items-center'> Pause Distracting apps when you need time to focus</h1>
              </div>
              :
              <h1 className='text-xl text-center flex justify-center items-center my-24'> Pause Distracting apps when you need time to focus</h1>}
          </div>
        </div>
      </section>
    </>
  )
}

export default Focus