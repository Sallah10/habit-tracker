import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Use Prisma as the adapter to handle user storage
  adapter: PrismaAdapter(prisma),
  
  // Configure Google OAuth provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  
  // Optional: Customize session handling
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session
      session.user.id = user.id;
      return session;
    }
  }
};