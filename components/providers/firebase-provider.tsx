'use client';

import { ReactNode } from 'react';
import { db, auth } from '@/lib/firebase/config';

export function FirebaseProvider({ children }: { children: ReactNode }) {
  // Just check if Firebase is initialized
  if (!db || !auth) {
    return null;
  }

  return <>{children}</>;
} 