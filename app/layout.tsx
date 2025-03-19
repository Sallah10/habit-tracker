import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "./nav";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

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
  title: "Habit Tracker",
  description: "A Habit Tracker for Everyone Created by Sallah using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider> {/* Wrap the entire layout in SessionProvider */}
          <Nav />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// // import ClientNavWrapper from "./clientNavWrapper";
// import Nav from "./nav"
// // import SessionWrapper from "./SessionWrapper";
// import { SessionProvider } from "next-auth/react";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Habit Tracker",
//   description: "A Habit Tracker for Everyone Created by Sallah using Next.js",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         <SessionProvider>
//           {/* <ClientNavWrapper /> */}
//           <Nav />
//           {/* <SessionWrapper> */}
//           {children}
//           {/* </SessionWrapper> */}
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }
