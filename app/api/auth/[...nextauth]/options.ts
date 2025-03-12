// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";

// export const authOptions: NextAuthOptions = {
//   // Use Prisma as the adapter to handle user storage
//   adapter: PrismaAdapter(prisma),
  
//   // Configure Google OAuth provider
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//     }),
//     CredentialsProvider({
//       // The name to display on the sign-in form (optional)
//       name: "Credentials",
      
//       // Configure the fields for login
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
      
//       // Authorization logic
//       async authorize(credentials) {
//         // Check if credentials exist
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         // Find user in the database
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         });

//         // If no user found
//         if (!user) {
//           return null;
//         }

//         // Compare passwords
//         const isPasswordValid = await bcrypt.compare(
//           credentials.password,
//           user.password || ''
//         );

//         // If password is incorrect
//         if (!isPasswordValid) {
//           return null;
//         }

//         // If authentication successful, return user object
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name
//         };
//       }
//     })
//   ],
  
//   // Optional: Customize session handling
//   callbacks: {
//     async session({ session, user }) {
//       // Add user ID to the session
//       session.user.id = user.id;
//       return session;
//     }
//   }
// };
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin", // Custom login page (Optional)
  },

  secret: process.env.NEXTAUTH_SECRET,
};
