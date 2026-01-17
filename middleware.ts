import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // This function runs if the user IS authenticated
    // Just let them through to the page they requested
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This checks if the user is logged in
        // If token exists = user is logged in = return true
        // If no token = user not logged in = return false
        return !!token;
      }
    },
  }
);

// This tells Next.js which routes to protect
export const config = {
  matcher: ['/admin/:path*']  // Protect /admin and all sub-routes
};