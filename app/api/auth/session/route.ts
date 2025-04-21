import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

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

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ status: "success" });
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
    response.cookies.delete("__session");
    return response;
  } catch (error) {
    console.error("Error clearing session:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 