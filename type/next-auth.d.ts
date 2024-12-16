import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    password?: string; // Add this line
  }

}