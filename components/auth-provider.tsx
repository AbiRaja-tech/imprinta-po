"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Check if user is logged in on mount - only once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user")

          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        // Clear potentially corrupted auth data
        if (typeof window !== "undefined") {
          localStorage.removeItem("user")
        }
      } finally {
        setIsLoading(false)
        setAuthChecked(true)
      }
    }

    checkAuth()
  }, [])

  // Handle routing based on auth state - only after auth has been checked
  useEffect(() => {
    if (!authChecked) return

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register", "/forgot-password"]
    const isPublicRoute = publicRoutes.includes(pathname)

    // Skip auth check for public routes
    if (isPublicRoute) {
      setIsAuthorized(true)

      // If user is logged in and trying to access login page, redirect to dashboard
      if (user && pathname === "/login") {
        router.push("/dashboard")
      }
      return
    }

    // If user is not logged in and trying to access protected route, redirect to login
    if (!user && !isPublicRoute) {
      router.push("/login")
      return
    }

    // User is authorized for protected routes
    setIsAuthorized(true)
  }, [user, authChecked, pathname, router])

  // Show loading state
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0d14]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return children
}
