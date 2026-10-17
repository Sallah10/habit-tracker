import type { Metadata, Viewport } from "next";
import { Baloo_Tamma_2 } from "next/font/google";
import "./globals.css";
import Nav from "./nav";
import SessionWrapper from "./SessionWrapper";
import ServiceWorkerRegister from "./ServiceWorkerRegister";

const font = Baloo_Tamma_2({
  variable: "--font-sans",
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
    <html lang="en" className={`dark ${font.variable}`}>
      <body className="antialiased">
        <SessionWrapper>
          <Nav />
          {children}
          <ServiceWorkerRegister />
        </SessionWrapper>
      </body>
    </html>
  );
}
