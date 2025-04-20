"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Only redirect after auth state is determined
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, loading, router])

  // Show loading state while determining auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0d14]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  )
}
