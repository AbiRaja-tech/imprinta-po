import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the user is trying to access the users page
  if (request.nextUrl.pathname.startsWith("/users")) {
    // Get the session cookie
    const session = request.cookies.get("session");

    // If there's no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify the session by making a call to your API route
      const response = await fetch(new URL("/api/auth/verify", request.url), {
        headers: {
          Cookie: `session=${session.value}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const data = await response.json();
      
      // Check if user is admin
      if (data.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*"],
}; 