import React from 'react'

const nav = () => {
  return (
    <div>
         <nav>
            <img src="assets/images/logo.svg" alt="">
            <input type="checkbox" id="menu">
            <label for="menu" class="open-menu-icon"> <img src="assets/images/menu.svg" alt="open-menu"> </label>
            </input>
            {/* <!-- <div class="nav-links">
                <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">New</a> </li>
                <li><a href="#">Popular</a> </li>
                <li><a href="#">Trending</a> </li>
                <li><a href="#">Categories</a></li> 
                </ul>
            </div> --> */}
            <label for="menu" id="overlay"></label>
            <div class="nav-links">
            <label for="menu" class="close-menu-icon">
                <img src="assets/images/close_menu.png" alt="Close-menu-icon">
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