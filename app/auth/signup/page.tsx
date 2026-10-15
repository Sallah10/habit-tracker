"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import Hero from "../../hero";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import google from "/app/assets/google.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      router.push("/auth/login");
    } catch (err) {
      setError(`Network error. Please try again. ${err}`);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError(`Google sign-up failed: ${err}`);
    }
  };

  return (
    <section className="general items-center">
      <Hero />
      <Card className="w-full max-w-md border-white/10 bg-[#33313f] text-white shadow-2xl">
        <CardContent className="pt-6">
          <h1 className="text-center text-2xl font-semibold">Create your account</h1>
          <p className="mb-6 mt-1 text-center text-sm text-gray-300">
            Start tracking your habits today
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
            className="w-full gap-2 border-white/20 bg-white/5 text-base text-white hover:bg-white/10 hover:text-white"
          >
            Continue with Google
            <Image src={google} alt="" width={20} height={20} />
          </Button>

          <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
            <hr className="w-full border-white/10" />
            OR
            <hr className="w-full border-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="name" className="label">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className="field"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="field"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full text-base">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-gray-300">
          Already have an account?
          <Link href="/auth/login" className="ml-1 font-medium text-blue-300 hover:underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Signup;
