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
  const { data: session, status } = useSession(); // Get session + status

  const toggleClick = () => {
    setNavClick(!navClick);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Prevent rendering while session is loading
  if (status === "loading") {
    return null; // Or return a loading spinner
  }

  return (
    <>
      <nav className="bg-[#26252F] text-white">
        <div className="flex justify-between items-start px-10 py-8">
          {/* Logo */}
          <Image src={logo} alt="logo" width={100} height={100} />

          {/* Hamburger Menu (Mobile) */}
          <Image
            src={openmenu}
            alt="open-menu"
            width={26}
            height={26}
            onClick={toggleClick}
            className={navClick ? "hidden w-0" : "flex fill-white md:hidden"}
          />

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-blue-300">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-blue-300">
              Dashboard
            </Link>
            {session ? (
              <button onClick={handleLogout} className="hover:text-blue-300">
                Logout
              </button>
            ) : (
              <Link href="/login" className="hover:text-blue-300">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          {navClick && (
            <div className="flex flex-col right-0 top-0 items-end p-8 gap-4 bg-[#3d3b50] ml-auto mt-auto rounded-lg">
              <Image
                src={closemenu}
                alt="close-menu"
                width={26}
                height={26}
                onClick={toggleClick}
                style={{ filter: "brightness(0) invert(1)" }} // Change SVG color to white
              />
              <div className="flex gap-8 flex-col">
                <Link href="/" className="hover:text-blue-300">
                  Home
                </Link>
                <Link href="/dashboard" className="hover:text-blue-300">
                  Dashboard
                </Link>
                {session ? (
                  <button onClick={handleLogout} className="hover:text-blue-300">
                    Logout
                  </button>
                ) : (
                  <Link href="/login" className="hover:text-blue-300">
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Nav;