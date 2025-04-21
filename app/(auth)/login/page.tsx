"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import { ErrorBoundary } from "react-error-boundary"

function LoginForm() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Handle auth redirects
  useEffect(() => {
    if (!loading && user) {
      console.log('User already logged in, redirecting to dashboard')
      router.replace("/dashboard")
    }
  }, [loading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Attempting login with:', formData.email)
      await signIn(formData.email, formData.password)
      console.log('Login successful')
      toast.success("Logged in successfully")
      router.replace("/dashboard")
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0d14] text-white">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  // Don't render the form if user is already logged in
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0d14]">
      <div className="w-full max-w-sm space-y-8 rounded-lg border border-gray-700 bg-[#0f1219] p-6 text-white">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </div>
    </div>
  )
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0d14] text-white">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong:</h2>
        <pre className="mt-2 text-sm text-red-500">{error.message}</pre>
        <Button 
          onClick={resetErrorBoundary} 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <LoginForm />
    </ErrorBoundary>
  )
}
