"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import "./globals.css";
import logo from "./assets/HabiTapp.png";
import closemenu from "/app/assets/close_menu.png";
import openmenu from "/app/assets/icon-menu.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// The signed-in destinations. Dashboard is home base; the rest hang off it.
const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tracker", label: "Log" },
  { href: "/dashboard/mostusedapp", label: "Insights" },
  { href: "/dashboard/focus", label: "Focus" },
];

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${isActive(href) ? "text-amber-400" : "text-white/80 hover:text-white"
    }`;

  const logoHref = signedIn ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#26252F]/90 backdrop-blur-md text-white font-bold">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href={logoHref} aria-label="HabiTapp home" className="shrink-0">
          <Image src={logo} alt="HabiTapp" width={104} height={38} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {signedIn ? (
            <>
              {appLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClass(href)}>
                  {label}
                </Link>
              ))}
              <span className="h-5 w-px bg-white/15" aria-hidden="true" />
              <span className="flex items-center gap-2 text-sm text-white/70">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-[#26252F]">
                  {(session?.user?.name?.[0] || "U").toUpperCase()}
                </span>
                {session?.user?.name?.split(" ")[0] || "You"}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/#how" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
                How it works
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-[#26252F] transition-colors hover:bg-amber-300"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <Image
            src={openmenu}
            alt=""
            width={26}
            height={26}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[#3d3b50] text-white transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute right-6 top-6"
          aria-label="Close menu"
        >
          <Image src={closemenu} alt="" width={28} height={28} />
        </button>

        <div className="flex flex-col items-center gap-6 text-2xl">
          {signedIn ? (
            <>
              {appLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClass(href)}>
                  {label}
                </Link>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/80 transition-colors hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/#how" className="text-white/80 transition-colors hover:text-white">
                How it works
              </Link>
              <Link href="/auth/login" className="text-white/80 transition-colors hover:text-white">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-amber-400 px-6 py-2 font-semibold text-[#26252F]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
