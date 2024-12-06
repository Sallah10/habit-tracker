'use client'
import React from 'react'
import Hero from "../../hero"
import { Switch } from "@/components/ui/switch"


const Focus = () => {
  const [focusMode, setFocusMode] = React.useState(false)

  const toggleFocusMode = () => {
    setFocusMode(!focusMode)
  }
  return (
    <>
      <section className='general'>
        <Hero/>
        <div className='bg-[#D9D9D9] rounded-lg gap-10 flex flex-col px-4 py-6 mb-10'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl'> Focus Mode </h1>
            <Switch
            checked={focusMode}
            onCheckedChange={toggleFocusMode}/>
          </div>
            <div className='flex self-center'>
              { focusMode ? 
                 <h2> toggled</h2>
                : 
               <h1 className='text-xl text-center flex justify-center items-center my-24'> Pause Distracting apps when you need time to focus</h1>}
            </div>
        </div>
      </section>
    </>
  )
}

export default Focus