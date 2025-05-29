// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // You can add custom logic here
    console.log(`Authenticated request: ${req}`);
  },
  {
    callbacks: {
      authorized: ({ token }) => token !== null
    },
    // Optional: specify which routes to protect
    pages: {
      signIn: '/auth/login'
    }
  }
);

// Protect specific routes
export const config = { 
  matcher: [
    '/dashboard/:path*',
    '/tracker/:path*',
    // '/profile/:path*'
  ]
};