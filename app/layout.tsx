import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import SessionWrapper from "./SessionWrapper"; // Import the SessionWrapper
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className="dark">
      <body className={`${sans.variable} antialiased`}>
        <SessionWrapper> {/* Wrap the entire layout in SessionWrapper */}
          <Nav />
          {children}
          <ServiceWorkerRegister />
        </SessionWrapper>
      </body>
    </html>
  );
}
