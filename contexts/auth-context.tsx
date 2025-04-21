"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Auth, User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { FirebaseApp } from 'firebase/app'
import { app } from '@/lib/firebase/config'
import { getCurrentUserRole, signOut as authSignOut } from '@/lib/firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'

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

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    console.log('[AuthProvider] Handling navigation to:', path);
    // Force a hard navigation by using window.location
    window.location.href = path;
  };

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth state listener')
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthProvider] Auth state changed:', { 
        userId: firebaseUser?.uid,
        email: firebaseUser?.email,
        isAuthenticated: !!firebaseUser 
      })

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          console.log('[AuthProvider] User document fetched:', {
            exists: userDoc.exists(),
            data: userDoc.data()
          })

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.role as 'admin' | 'user')
            
            // Set permissions based on role
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
          setLoading(false)

          // Check current pathname
          const currentPath = window.location.pathname
          console.log('[AuthProvider] Current path:', currentPath)
          
          if (currentPath === '/login') {
            console.log('[AuthProvider] Redirecting to dashboard from login')
            handleNavigation('/dashboard')
          }
        } catch (error) {
          console.error('[AuthProvider] Error setting up user:', error)
          setLoading(false)
        }
      } else {
        console.log('[AuthProvider] No user found, resetting state')
        setUser(null)
        setUserRole(null)
        setPermissions(null)
        setIsAuthenticated(false)
        setLoading(false)

        // Check if we need to redirect to login
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          console.log('[AuthProvider] Redirecting to login')
          handleNavigation('/login')
        }
      }
    })

    return () => {
      console.log('[AuthProvider] Cleaning up auth state listener')
      unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Signing out')
      await authSignOut()
      handleNavigation('/login')
    } catch (error) {
      console.error('[AuthProvider] Error signing out:', error)
    }
  }

  console.log('[AuthProvider] Current state:', {
    isAuthenticated,
    userRole,
    loading,
    permissions
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