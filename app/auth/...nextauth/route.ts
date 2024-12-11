import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"  // Your Prisma client

const handler = NextAuth({
  // Where to store user information
  adapter: PrismaAdapter(prisma),
  
  // How people can log in
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      
      // The credentials object defines what fields are submitted
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      
      // This is where the magic of checking login happens!
      async authorize(credentials) {
        // Here you'll add your login validation logic
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in your database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Check if user exists and password is correct
        // YOU MUST IMPLEMENT PASSWORD HASHING!
        if (user) {
          return user
        }

        // If no user found or password incorrect
        return null
      }
    })
  ],
  
  // Custom pages for authentication
  pages: {
    signIn: '/login',  // Your custom login page
  },
  
  // Extra security and customization
  session: {
    strategy: "jwt"  // How we keep track of logged-in users
  },
  
  // What happens during different auth stages
  callbacks: {
    // Modify the session to include user ID
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }