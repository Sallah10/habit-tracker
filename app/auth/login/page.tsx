"use client";
import React from "react";
import Hero from "../../hero";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import Link from "next/link";
import google from "/app/assets/google.png";
import Image from "next/image";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // NextAuth bounces back to this page with ?error=... when OAuth fails.
  // Read it off the URL so Google misconfiguration isn't a silent failure.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("error");
    if (!code) return;

    const messages: Record<string, string> = {
      OAuthAccountNotLinked:
        "That Google account isn't linked to a login. Sign in with your email and password instead.",
      AccessDenied: "Access denied for that account.",
      Configuration: "Sign-in isn't configured yet. Try email and password.",
      OAuthCallback: "Google sign-in was cancelled or failed. Try again.",
      CredentialsSignin: "Invalid email or password.",
      Callback: "Sign-in failed. Please try again.",
      google: "Google sign-in isn't set up yet. Use email and password.",
    };

    setError(
      messages[code] ||
        "Sign-in failed. Please try again or use your email and password."
    );
    // Clear the error from the URL so a refresh doesn't re-show it.
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      redirect: true,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <section className="general items-center">
      <Hero />
      <Card className="w-full max-w-md border-white/10 bg-[#33313f] text-white shadow-2xl">
        <CardContent className="pt-6">
          <h1 className="text-center text-2xl font-semibold">Welcome back</h1>
          <p className="mb-6 mt-1 text-center text-sm text-gray-300">
            Sign in to keep your streak going
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
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
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="field"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full text-base">
              {loading ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <hr className="w-full border-white/10" />
              OR
              <hr className="w-full border-white/10" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full gap-2 border-white/20 bg-white/5 text-base text-white hover:bg-white/10 hover:text-white"
            >
              Sign in with Google
              <Image src={google} alt="" width={20} height={20} />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-gray-300">
          Don&apos;t have an account?
          <Link href="/auth/signup" className="ml-1 font-medium text-blue-300 hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Login;
