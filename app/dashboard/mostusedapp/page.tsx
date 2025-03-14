import React from 'react'
import Hero from "../../hero"
import Image from 'next/image'
import icon1 from "/app/assets/ContainerIcon.png"
import icon2 from "/app/assets/ContainerIcon-1.png"
import icon3 from "/app/assets/ContainerIcon-2.png"
import icon4 from "/app/assets/ContainerIcon-3.png"


const Used = () => {
  return (
    <>
      <section className='general p-4'>
        <Hero />
        <div className='bg-[#D9D9D9] rounded-lg flex flex-col gap-4 px-4 py-6 mb-10'>
          <h1 className='text-2xl self-center flex '> Most Used Apps:</h1>
          <div className='gap-4 grid-cols-1 items-center grid lg:grid-cols-3 md:grid-cols-2'>
            <div className='flex flex-col gap-4 pb-3 justify-center sm:border-b-4 md:border-none border-gray-900'>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon2} alt='Tiktok' />
                <div>
                  <h1 className='text-xl'> Tiktok </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon3} alt='Twitter' />
                <div>
                  <h1 className='text-xl'> Twitter </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon4} alt='Snapchat' />
                <div>
                  <h1 className='text-xl'> Snapchat </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4 justify-center pb-3 border-b-4  md:border-none border-gray-900'>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon2} alt='Tiktok' />
                <div>
                  <h1 className='text-xl'> Tiktok </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon3} alt='Twitter' />
                <div>
                  <h1 className='text-xl'> Twitter </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon4} alt='Snapchat' />
                <div>
                  <h1 className='text-xl'> Snapchat </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-4 justify-center pb-3 border-b-4  md:border-none border-gray-900'>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon1} alt='Discord' />
                <div>
                  <h1 className='text-xl'> Discord </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon2} alt='Tiktok' />
                <div>
                  <h1 className='text-xl'> Tiktok </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon3} alt='Twitter' />
                <div>
                  <h1 className='text-xl'> Twitter </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
              <div className='socials'>
                <Image src={icon4} alt='Snapchat' />
                <div>
                  <h1 className='text-xl'> Snapchat </h1>
                  <p>2 hours and 17 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Used