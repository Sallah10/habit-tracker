"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Hero from "../../hero";
import { useState } from "react";
import { useRouter } from "next/navigation";
import google from "/app/assets/google.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return;
      }
      // Redirect to login or automatically sign in
      router.push("/auth/login");
    } catch (err) {
      setError(`Network error. Please try again. ${err}`);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Initiate Google OAuth sign-in
      await signIn("google", { callbackUrl: "/" }); // Redirect to home after sign-up
    } catch (err) {
      setError(`Google sign-up failed: ${err}`);
    }
  };

  return (
    <>
      <section className="general">
        <Hero />
        <Card className="bg-transparent border-0 self-center">
          <CardContent>
            <div className="space-y-4 mb-4">
              <Button
                variant="outline"
                className="w-full text-base flex gap-2 hover:text-gray-400"
                onClick={handleGoogleSignUp}
              >
                Continue with Google
                <Image src={google} alt="google-icon" width={20} height={20} />
              </Button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <hr className="w-full mr-2" />
              <span className="text-gray-500">OR</span>
              <hr className="w-full ml-2" />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-8">
                <div className="flex flex-col space-y-1.5 gap-4">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="User"
                    className="bg-[#D9D9D9] text-center shadow-2xl"
                  />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-[#D9D9D9] text-center shadow-2xl"
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="bg-[#D9D9D9] text-center shadow-2xl"
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="bg-[#D9D9D9] text-center shadow-2xl"
                  />
                </div>
                {error && (
                  <p style={{ color: "red", margin: 0, display: "flex" }}>
                    {error}
                  </p>
                )}
                <Button type="submit">Sign Up</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="text-white">
            Already have an account?{" "}
            <a href="/auth/login" className="ml-1">
              Login Here
            </a>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};

export default Signup;