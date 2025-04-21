import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;
  
  // Get the session cookie
  const session = request.cookies.get("session");

  // If there's no session, redirect to login
  if (!session) {
    console.log('No session found, redirecting to login');
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the session by making a call to your API route
    const verifyUrl = new URL("/api/auth/verify", request.url);
    console.log('Verifying session at:', verifyUrl.toString());
    
    const response = await fetch(verifyUrl, {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    if (!response.ok) {
      console.log('Session verification failed:', await response.text());
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Handle root path redirect
    if (pathname === '/') {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If we're at /dashboard/dashboard, redirect to /dashboard
    if (pathname === '/dashboard/dashboard') {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Update matcher to exclude public routes and assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register, signup (auth pages)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|signup).*)",
  ],
}; 