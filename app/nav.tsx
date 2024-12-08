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
        <div className='flex justify-between p-10'>
          {/* logos */}
          <Image src={logo} alt='logo' width={100} height={100}/>
          <Image src={openmenu} alt='open-menu' width={26} height={26} onClick={toogleClick}/>
        </div>
       {!setNavClick && 
        <div className='flex flex-col h-[100vh]'>
            <Image src={closemenu} alt='close-menu' width={26} height={26}/>
            <div className='flex gap-8'>
              <a href="">Home</a>
              <a href="">Dashboard</a>
              <a href="">Logout</a>
            </div>
        </div> }
      </nav>
    </>
  )
}

export default nav