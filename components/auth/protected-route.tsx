"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Define which routes require admin access
const ADMIN_ROUTES = ['/settings', '/users', '/reports']

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/login')
        return
      }

      // If authenticated but trying to access admin routes without admin role
      if (ADMIN_ROUTES.includes(pathname) && !isAdmin()) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, loading, pathname, router, isAdmin])

  // Show nothing while checking auth
  if (loading) {
    return null
  }

  // If not authenticated, don't render anything
  if (!user) {
    return null
  }

  // If trying to access admin route without permission, don't render
  if (ADMIN_ROUTES.includes(pathname) && !isAdmin()) {
    return null
  }

  // If all checks pass, render the protected content
  return <>{children}</>
} 