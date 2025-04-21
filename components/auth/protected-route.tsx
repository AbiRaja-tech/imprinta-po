"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { PROTECTED_ROUTES, hasPermission } from '@/lib/access-control'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, permissions } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/login')
        return
      }

      // Check if current route requires specific permissions
      const requiredPermission = PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES]
      if (requiredPermission && permissions && !hasPermission({ ...permissions, role: 'user' }, requiredPermission)) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, loading, pathname, router, permissions])

  // Show nothing while checking auth
  if (loading) {
    return null
  }

  // If not authenticated, don't render anything
  if (!user) {
    return null
  }

  // Check route permissions
  const requiredPermission = PROTECTED_ROUTES[pathname as keyof typeof PROTECTED_ROUTES]
  if (requiredPermission && permissions && !hasPermission({ ...permissions, role: 'user' }, requiredPermission)) {
    return null
  }

  // If all checks pass, render the protected content
  return <>{children}</>
} 