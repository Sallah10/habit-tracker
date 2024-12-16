"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Hero from "../hero"
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confrimPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confrimPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      // Redirect to login or automatically sign in
      router.push('/login');
    } catch (err) {
      // "Network error. Please try again. {err}"
      setError(`${err}`)
    }
};
  return (
    <>
      <section className='general'>
        <Hero/>
        <Card className="bg-transparent border-0 self-center">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-10">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    // id="name" 
                    placeholder="User" 
                    className='bg-[#D9D9D9] text-center shadow-2xl'/>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className='bg-[#D9D9D9] text-center shadow-2xl' 
                  />
                  <Input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    // id="name" 
                    className='bg-[#D9D9D9] text-center shadow-2xl'/>
                  <Input 
                    type="password"
                    value={confrimPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    // id="name"
                    className='bg-[#D9D9D9] text-center shadow-2xl'/>
                </div>
                {error && <p style={{ color: 'red', margin: 0, display:'flex'}}>{error}</p>}
                <Button type="submit">Sign Up</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className='text-white'>
            Already have an account? <a href="/login" className='ml-1'>Login Here</a>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}

export default Signup