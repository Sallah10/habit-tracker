"use client"
import {useState} from 'react'
import Image from 'next/image'
import "./globals.css";
import  logo from "./assets/HabiTapp.png"
import  closemenu from "./assets/close_menu.png"
import openmenu from "./assets/icon-menu.svg"

const nav = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [navClick, setNavClick] = useState(false)
  const toogleClick = () => {
    setNavClick(!navClick);
  };
  return (
    <>
      <nav className='bg-[#26252F]  text-white'>
        <div className='flex justify-between items-start px-10 py-8'>
          {/* logos */}
          <Image src={logo} alt='logo' width={100} height={100}/>
          <Image src={openmenu} alt='open-menu' width={26} height={26} onClick={toogleClick} className={navClick ? 'hidden w-0': 'flex fill-white md:hidden'}/>
          <div className='hidden md:flex gap-8 items-center hover:text-blue-300'>
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Logout</a>
          </div>
          {navClick && 
          <div className='flex flex-col  items-end p-8 gap-4 bg-[#3d3b50] ml-auto rounded-lg'>
              <Image src={closemenu} alt='close-menu' width={26} height={26} onClick={toogleClick}/>
              <div className='flex gap-8 flex-col'>
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/login">Logout</a>
              </div>
          </div> }
        </div>
      </nav>
    </>
  )
}

export default nav