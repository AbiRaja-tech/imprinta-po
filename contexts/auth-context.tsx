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
  console.log('[AuthProvider] Initializing')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [permissions, setPermissions] = useState<AuthContextType['permissions']>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Function to handle navigation
  const handleNavigation = async (path: string) => {
    if (isNavigating) return;
    console.log('[AuthProvider] Handling navigation to:', path);
    setIsNavigating(true);
    
    try {
      // Set session cookie
      if (path === '/dashboard' && user) {
        const idToken = await user.getIdToken(true); // Force refresh token
        if (idToken) {
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: idToken }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to set session');
          }
        }
      }

      // Use router for navigation
      await router.replace(path);
    } catch (error) {
      console.error('[AuthProvider] Navigation error:', error);
      // If session creation fails, sign out
      await signOut();
    } finally {
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('[AuthProvider] Setting up auth state listener')
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      console.log('[AuthProvider] Auth state changed:', { 
        userId: firebaseUser?.uid,
        email: firebaseUser?.email,
        isAuthenticated: !!firebaseUser,
        currentPath: pathname
      });

      try {
        if (firebaseUser) {
          // Verify session is valid
          const sessionResponse = await fetch('/api/auth/verify');
          const isSessionValid = sessionResponse.ok;

          if (!isSessionValid) {
            // If session is invalid, get new token and create session
            const idToken = await firebaseUser.getIdToken(true);
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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

          // Only redirect if we're on the login page and not already navigating
          if (pathname === '/login' && !isNavigating) {
            console.log('[AuthProvider] On login page, redirecting to dashboard')
            await handleNavigation('/dashboard')
          }
        } else {
          setUser(null)
          setUserRole(null)
          setPermissions(null)
          setIsAuthenticated(false)

          // Only redirect if not on login page and not already navigating
          if (pathname !== '/login' && !isNavigating) {
            console.log('[AuthProvider] Not on login, redirecting to login')
            await handleNavigation('/login')
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Error in auth state change:', error)
        // On error, reset state and redirect to login
        setUser(null)
        setUserRole(null)
        setPermissions(null)
        setIsAuthenticated(false)
        if (pathname !== '/login') {
          await handleNavigation('/login')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false;
      console.log('[AuthProvider] Cleaning up auth state listener')
      unsubscribe()
    }
  }, [pathname, isNavigating])

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Signing out')
      await authSignOut()
      // Clear session
      await fetch('/api/auth/session', { method: 'DELETE' });
      await handleNavigation('/login')
    } catch (error) {
      console.error('[AuthProvider] Error signing out:', error)
      // Force navigation to login even if error occurs
      router.push('/login')
    }
  }

  console.log('[AuthProvider] Current state:', {
    isAuthenticated,
    userRole,
    loading,
    permissions,
    currentPath: pathname
  })

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