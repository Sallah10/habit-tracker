import React from 'react'
import Hero from "../hero"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  // CardHeader,
  // CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const login = () => {
  return (
    <>
      <section className='general'>
        <Hero/>
        <Card className="bg-transparent border-0 self-center">
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-14">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Input id="name" placeholder="User" className='bg-[#D9D9D9] text-center text-base'/>
                  <Input id="name" placeholder="Password" className='bg-[#D9D9D9] text-center text-base'/>
                </div>
                <Button className='text-base'>Login</Button>
              </div>
            </form>
          </CardContent>
          {/* <Button>Deploy</Button> */}
          <CardFooter className='text-white'>
            Don&apos;t have an account? <a href="/signup" className='ml-1'>Sign Up Here</a>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default login