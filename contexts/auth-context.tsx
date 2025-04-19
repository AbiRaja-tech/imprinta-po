"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/config'
import type { User, AuthState } from '@/lib/types/auth'

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as Omit<User, 'id'>
          setState({
            user: {
              id: firebaseUser.uid,
              ...userData,
              createdAt: userData.createdAt.toDate(),
            },
            loading: false,
          })
        } else {
          setState({ user: null, loading: false })
        }
      } else {
        setState({ user: null, loading: false })
      }
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    setState({ user: null, loading: false })
  }

  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={{ ...state, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 