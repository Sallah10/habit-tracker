"use client";
import { useState } from "react";
import Image from "next/image";
import "./globals.css";
import logo from "./assets/HabiTapp.png";
import closemenu from "/app/assets/close_menu.png";
import openmenu from "/app/assets/icon-menu.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const links = [
  { href: "/", label: "Home" },
  { href: "/tracker", label: "Tracker" },
  { href: "/dashboard", label: "Dashboard" },
];

const Nav = () => {
  const [navClick, setNavClick] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const toggleClick = () => setNavClick(!navClick);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `transition-colors ${
      isActive(href) ? "text-blue-300" : "text-white hover:text-blue-300"
    }`;

  return (
    <nav className="bg-[#26252F]/95 backdrop-blur-md text-white border-b border-white/10 sticky top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-6 md:px-10 py-4">
        {/* Logo */}
        <Link href="/" aria-label="HabiTapp home">
          <Image src={logo} alt="HabiTapp logo" width={110} height={40} priority />
        </Link>

        {/* Hamburger Menu (Mobile) */}
        <Image
          src={openmenu}
          alt="Open menu"
          width={30}
          height={30}
          onClick={toggleClick}
          className="md:hidden cursor-pointer"
          style={{ filter: "brightness(0) invert(1)" }}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
          {status === "loading" ? (
            <span className="h-4 w-14 animate-pulse rounded bg-white/20" />
          ) : session ? (
            <button onClick={handleLogout} className="hover:text-blue-300 transition-colors">
              Logout
            </button>
          ) : (
            <Link
              href="/auth/signup"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#26252F] transition-colors hover:bg-blue-300"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 bg-[#3d3b50] flex flex-col items-center justify-center text-white
          transition-transform duration-300 ease-in-out ${
            navClick ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
      >
        <Image
          src={closemenu}
          alt="Close menu"
          width={30}
          height={30}
          onClick={toggleClick}
          className="absolute top-6 right-6 cursor-pointer"
        />

        <div className="flex flex-col gap-6 text-2xl">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={toggleClick}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
          {status === "loading" ? null : session ? (
            <button onClick={handleLogout} className="hover:text-blue-300 transition-colors">
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={toggleClick}
              className="hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
