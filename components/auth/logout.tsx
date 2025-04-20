'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

export async function handleLogout() {
  try {
    await signOut(auth);
    // Redirect to login page after successful logout
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
  }
} 