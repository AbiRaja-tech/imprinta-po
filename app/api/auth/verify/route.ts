'use server';

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth as auth } from '@/lib/firebase/admin';
import { getUserById } from '@/lib/firebase/users';

export async function GET(request: Request) {
  try {
    const sessionCookie = request.headers.get('Cookie')?.split(';')
      .find(c => c.trim().startsWith('session='))
      ?.split('=')[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const user = await getUserById(decodedClaims.uid);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      uid: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
} 