import React from 'react'
import Image from 'next/image'
import "./globals.css";

const nav = () => {
  return (
    <div>
         {/* <input type="checkbox" id="menu">    <input type="checkbox" id="menu">*/}
         <nav>
         
            <label htmlFor="menu" className="open-menu-icon"> <Image src="/assets/menu.svg" alt="open-menu" width={100} height={100}/> </label>

            <div className="nav-links">
                <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Dashboard</a> </li>
                <li><a href="#">login</a> </li>
                <li><a href="#">signup</a> </li>
                </ul>
            </div>
            <label htmlFor="menu" id="overlay"></label>
            <div className="nav-links">
            <label htmlFor="menu" className="close-menu-icon">
                <Image src="/assets/close_menu.png" alt="Close-menu-icon" width={100} height={100}/>
            </label>
            
                <a href="#">Home</a>
                <a href="#">New</a> 
                <a href="#">Popular</a> 
                <a href="#">Trending</a> 
                <a href="#">Categories</a> 
                
            </div>
        </nav>
    </div>
  )
}

export default nav