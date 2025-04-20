import { auth } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

// Create session cookie
export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    // Create response with cookie
    const response = NextResponse.json({ status: "success" });
    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000, // Convert to seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Clear session cookie
export async function DELETE() {
  try {
    const response = NextResponse.json({ status: "success" });
    response.cookies.delete("__session");
    return response;
  } catch (error) {
    console.error("Error clearing session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 