import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth as auth } from "@/lib/firebase/admin";

export const dynamic = 'force-dynamic';

// Create session cookie
export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; // 1 week
    const sessionCookie = await auth.createSessionCookie(token, { expiresIn });

    const response = NextResponse.json({ status: "success" });
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000, // Convert to seconds
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Clear session cookie
export async function DELETE() {
  try {
    const response = NextResponse.json({ status: "success" });
    response.cookies.delete("session");
    return response;
  } catch (error) {
    console.error("Error clearing session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 