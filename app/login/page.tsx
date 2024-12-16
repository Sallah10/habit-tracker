"use client";
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
import google from "../assets/google.png"
import Image from 'next/image'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('');

    const result = await signIn('credentials', {
      redirect: false,  // Don't automatically redirect
      email,
      password
    })

    if (result?.error) {
      // Handle login error
      setError('Invalid email or password');
    } else {
      // Redirect to dashboard or home page
      router.push('/dashboard')
    }
  }
  
  const handleGoogleSignIn = async () => {
    await signIn('google', { 
      redirect: true,
      callbackUrl: '/dashboard' 
    });
  };
  
  return (
    <>
      <section className='general'>
        <Hero/>
        <Card className="bg-transparent border-0 self-center">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-6">
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button type="submit"className='text-base  hover:text-gray-400'>Login</Button>
                <div className="text-white flex justify-center items-center my-0 p-0">
                  <span className='m-0 p-0'>OR</span>
                </div>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="m-0 text-base flex gap-2 hover:text-gray-400"
                >
                  Sign in with Google <Image src={google} alt="google-icon" width={20} height={20}/>
                </Button>
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

export default Login