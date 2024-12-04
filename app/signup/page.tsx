import React from 'react'
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
import Hero from "../hero"

const signup = () => {
  return (
    <>
      <section className='general'>
        <Hero/>
        <Card className="bg-transparent border-0">
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-14">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Input id="name" placeholder="User" className='bg-[#D9D9D9] text-center'/>
                  <Input id="name" placeholder="Password" className='bg-[#D9D9D9] text-center'/>
                  <Input id="name" placeholder="Confirm Password" className='bg-[#D9D9D9] text-center'/>
                </div>
                <Button>Sign Up</Button>
              </div>
            </form>
          </CardContent>
          {/* <Button>Deploy</Button> */}
          <CardFooter className='text-white'>
            Already have an account? <a href="/login" className='ml-1'>Login Here</a>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default signup