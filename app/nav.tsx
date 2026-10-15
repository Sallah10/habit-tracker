"use client";
import { useState } from "react";
import Image from "next/image";
import "./globals.css";
import logo from "./assets/HabiTapp.png";
import closemenu from "/app/assets/close_menu.png";
import openmenu from "/app/assets/icon-menu.svg";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Nav = () => {
  const [navClick, setNavClick] = useState(false);
  const { data: session, status } = useSession();

  const toggleClick = () => {
    setNavClick(!navClick);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <nav className="bg-[#26252F] text-white sticky top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center px-10 py-6">
          {/* Logo */}
          <Link href="/">
            <Image src={logo} alt="logo" width={100} height={100} />
          </Link>

          {/* Hamburger Menu (Mobile) */}
          <Image
            src={openmenu}
            alt="open-menu"
            width={30}
            height={30}
            onClick={toggleClick}
            className="md:hidden cursor-pointer"
            style={{ filter: "brightness(0) invert(1)" }}
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-blue-300">
              Home
            </Link>
            <Link href="/tracker" className="hover:text-blue-300">
              Tracker
            </Link>
            <Link href="/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
            {session ? (
              <button onClick={handleLogout} className="hover:text-blue-300">
                Logout
              </button>
            ) : (
              <Link href="/auth/login" className="hover:text-blue-300">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu - Sliding Animation */}
        <div
          className={`fixed inset-0 bg-[#3d3b50] flex flex-col items-center justify-center text-white 
          transition-transform duration-300 ease-in-out ${navClick ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
        >
          {/* Close Button */}
          <Image
            src={closemenu}
            alt="close-menu"
            width={30}
            height={30}
            onClick={toggleClick}
            className="absolute top-6 right-6 cursor-pointer"
          />

          {/* Menu Links */}
          <div className="flex flex-col gap-6 text-2xl">
            <Link href="/" onClick={toggleClick} className="hover:text-blue-300">
              Home
            </Link>
            <Link href="/tracker" onClick={toggleClick} className="hover:text-blue-300">
              Tracker
            </Link>
            <Link href="/dashboard" onClick={toggleClick} className="hover:text-blue-300">
              Dashboard
            </Link>
            {session ? (
              <button onClick={handleLogout} className="hover:text-blue-300">
                Logout
              </button>
            ) : (
              <Link href="/auth/login" onClick={toggleClick} className="hover:text-blue-300">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
