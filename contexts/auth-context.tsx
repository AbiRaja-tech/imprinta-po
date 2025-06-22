"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Auth, User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { FirebaseApp } from 'firebase/app'
import { app } from '@/lib/firebase/config'
import { getCurrentUserRole, signOut as authSignOut } from '@/lib/firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useRouter, usePathname } from 'next/navigation'

// Initialize Firebase services with proper typing
const auth: Auth = getAuth(app as FirebaseApp)

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: 'admin' | 'user' | null
  permissions: {
    canManageUsers: boolean
    canViewReports: boolean
    canManageSettings: boolean
  } | null
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [permissions, setPermissions] = useState<AuthContextType['permissions']>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const sessionResponse = await fetch('/api/auth/verify');
          
          if (!sessionResponse.ok) {
            const idToken = await firebaseUser.getIdToken(true);
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: idToken }),
            });
          }

          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.role as 'admin' | 'user')
            
            const rolePermissions = {
              canManageUsers: userData.role === 'admin',
              canViewReports: userData.role === 'admin',
              canManageSettings: userData.role === 'admin'
            }
            setPermissions(rolePermissions)
          }

          setUser(firebaseUser)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setUserRole(null)
          setPermissions(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        setUser(null)
        setUserRole(null)
        setPermissions(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && pathname === '/login') {
      router.replace('/dashboard');
    } else if (!isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [pathname, isAuthenticated, loading, router]);

  const signOut = async () => {
    try {
      await authSignOut()
      // Clear session
      await fetch('/api/auth/session', { method: 'DELETE' });
      router.replace('/login')
    } catch (error) {
      // Force navigation to login even if error occurs
      router.push('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        permissions,
        isAuthenticated,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 