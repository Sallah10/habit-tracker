/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import Hero from "../hero"
import { signIn } from "next-auth/react"
import { useState} from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await signIn('credentials', {
      redirect: false,  // Don't automatically redirect
      email,
      password
    })

    if (result?.error) {
      // Handle login error
      console.error("Login failed:", result.error)
    } else {
      // Redirect to dashboard or home page
      router.push('/dashboard')
    }
  }
  return (
    <>
      <section className='general'>
        <Hero/>
        <Card className="bg-transparent border-0 self-center">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-14">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Input  type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className='bg-[#D9D9D9] text-center text-base'/>
                  <Input  type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className='bg-[#D9D9D9] text-center text-base'/>
                </div>
                <Button type="submit"className='text-base'>Login</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className='text-white'>
            Don&apos;t have an account? <a href="/signup" className='ml-1'>Sign Up Here</a>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default login