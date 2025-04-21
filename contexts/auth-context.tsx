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
  const router = useRouter()
  const pathname = usePathname()

  // Function to handle navigation
  const handleNavigation = async (path: string) => {
    console.log('[AuthProvider] Handling navigation to:', path);
    try {
      // Force a hard navigation for login/dashboard routes
      if (path === '/login' || path === '/dashboard') {
        window.location.href = path;
      } else {
        await router.push(path);
      }
    } catch (error) {
      console.error('[AuthProvider] Navigation error:', error);
      window.location.href = path;
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

      setLoading(true);

      try {
        if (firebaseUser) {
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
            
            console.log('[AuthProvider] User data set:', {
              role: userData.role,
              permissions: rolePermissions
            })
          }

          setUser(firebaseUser)
          setIsAuthenticated(true)

          // Handle navigation after authentication
          if (pathname === '/login') {
            console.log('[AuthProvider] On login page, redirecting to dashboard')
            await handleNavigation('/dashboard')
          }
        } else {
          console.log('[AuthProvider] No user found, resetting state')
          setUser(null)
          setUserRole(null)
          setPermissions(null)
          setIsAuthenticated(false)

          if (pathname !== '/login') {
            console.log('[AuthProvider] Not on login, redirecting to login')
            await handleNavigation('/login')
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Error in auth state change:', error)
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
  }, [pathname])

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Signing out')
      await authSignOut()
      await handleNavigation('/login')
    } catch (error) {
      console.error('[AuthProvider] Error signing out:', error)
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