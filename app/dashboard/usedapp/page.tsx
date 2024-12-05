import React from 'react'
import Hero from "../../hero"
import Image from 'next/image'
import icon0 from "/app/assets/FB.png"
import icon1 from "/app/assets/Container Icon.png"
import icon2 from "/app/assets/Container Icon-1.png"
import icon3 from "/app/assets/Container Icon-2.png"
import icon4 from "/app/assets/Container Icon-3.png"


const used = () => {
  return (
    <>
      <section className='general'>
        <Hero/>
        <div className='bg-[#D9D9D9] rounded-lg flex flex-col gap-3 p-4'>
          <div>
            <div className='flex items-center gap-4'>
              <Image src={icon0} alt='Facebook'/>
              <div className='text-black self-center items-center justify-center'>
                <h1 className='text-xl mx-auto self-center items-center'> Facebook </h1>
                <p className='text-lg self-center'>2 hours and 17 minutes</p>
              </div>
            </div>
            <div>
              <Image src={icon1} alt='Discord'/>
              <div>
                <h1> Discord </h1>
                <p>2 hours and 17 minutes</p>
              </div>
            </div>
            <div>
              <Image src={icon2} alt='Tiktok'/>
              <div>
                <h1> Tiktok </h1>
                <p>2 hours and 17 minutes</p>
              </div>
            </div>
            <div>
              <Image src={icon3} alt='Twitter'/>
              <div>
                <h1> Twitter </h1>
                <p>2 hours and 17 minutes</p>
              </div>
            </div>
            <div>
              <Image src={icon4} alt='Snapchat'/>
              <div>
                <h1> Snapchat </h1>
                <p>2 hours and 17 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default used