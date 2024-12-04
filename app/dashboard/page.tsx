import React from 'react'
import Hero from "../hero"
import { Component } from "../chart"

const dashboard = () => {
  return (
    <>
      <section className='bg-[#26252F] min-h-screen pt-10 px-6 gap-16 flex flex-col'>
        <Hero/>
        <div className='flex flex-col gap-6 justify-between items-center'>
          <div className=' flex border-8 rounded-full items-center justify-center h-[300px] w-[300px] text-lg text-white'>
            <h1>10h 23m</h1>
          </div>
          <div className='text-white flex flex-col justify-center items-center gap-4'>
            <a href="/winddown"><h1 className='text-2xl'> Wind Down</h1><small className='items-center justify-center flex'>off</small></a>
            <a href="/focus"><h1 className='text-2xl'> Focus Mode</h1> <small className='items-center justify-center flex'>off</small></a>
            <a href="/usedapp"><h1 className='text-2xl'> Most Used Apps</h1></a>
          </div>
        </div>
        <Component/>
      </section>
    </>
  )
}

export default dashboard