'use server';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import { getUserById } from '@/lib/firebase/users';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie);
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