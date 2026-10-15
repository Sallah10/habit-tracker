import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "./nav";
import SessionWrapper from "./SessionWrapper"; // Import the SessionWrapper
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HabiTapp - Social Media Habit Tracker",
  description: "Track your social media habits, keep your streak alive and take your time back.",
  applicationName: "HabiTapp",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HabiTapp",
  },
};

export const viewport: Viewport = {
  themeColor: "#26252F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper> {/* Wrap the entire layout in SessionWrapper */}
          <Nav />
          {children}
          <ServiceWorkerRegister />
        </SessionWrapper>
      </body>
    </html>
  );
}
