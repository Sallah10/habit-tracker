import type { Metadata, Viewport } from "next";
import { Baloo_Tamma_2, Outfit } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import SessionWrapper from "./SessionWrapper";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Baloo Tamma 2 is rounded and warm - reads as "habit app", not "SaaS dashboard".
// Kept on headings only; at body size it gets hard to read.
const display = Baloo_Tamma_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      <body className={` ${display.variable} antialiased`}>
        <SessionWrapper> {/* Wrap the entire layout in SessionWrapper */}
          <Nav />
          {children}
          <ServiceWorkerRegister />
        </SessionWrapper>
      </body>
    </html>
  );
}
