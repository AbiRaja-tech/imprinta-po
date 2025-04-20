"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { Auth, User, onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { FirebaseApp } from 'firebase/app'
import { app } from '@/lib/firebase/config'
import { getCurrentUserRole, signOut as authSignOut } from '@/lib/firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// Initialize Firebase services with proper typing
const auth: Auth = getAuth(app as FirebaseApp)

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: 'admin' | 'user' | null;
  permissions: {
    canManageUsers: boolean;
    canViewReports: boolean;
    canManageSettings: boolean;
  } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null,
  permissions: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null)
  const [permissions, setPermissions] = useState<AuthContextType['permissions']>(null)

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', { userId: user?.uid });
      
      if (user) {
        try {
          setUser(user)
          // Get user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log('User document:', userDoc.data());
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role as 'admin' | 'user';
            setUserRole(role);
            
            // Get permissions from user document or set based on role
            if (userData.permissions) {
              console.log('Setting permissions from document:', userData.permissions);
              setPermissions(userData.permissions);
            } else {
              console.log('Setting default permissions for role:', role);
              setPermissions(role === 'admin' ? {
                canManageUsers: true,
                canViewReports: true,
                canManageSettings: true,
              } : {
                canManageUsers: false,
                canViewReports: false,
                canManageSettings: false,
              });
            }
          } else {
            console.warn('No user document found');
            setUserRole(null);
            setPermissions(null);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
          setUser(null)
          setUserRole(null)
          setPermissions(null)
        }
      } else {
        console.log('No user, clearing state');
        setUser(null)
        setUserRole(null)
        setPermissions(null)
      }
      
      setLoading(false)
    })

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await authSignOut()
      // State will be cleared by the auth state listener
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  console.log('Auth context current state:', {
    userId: user?.uid,
    userRole,
    permissions,
    loading,
    isAuthenticated: !!user
  });

  return (
    <AuthContext.Provider value={{ user, loading, userRole, permissions, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 