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
      router.replace("/dashboard/dashboard")
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
      router.replace("/dashboard/dashboard")
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 rounded-lg border border-border/40 bg-[#0f1219] p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong:</h2>
        <pre className="mt-2 text-sm text-red-500">{error.message}</pre>
        <Button onClick={resetErrorBoundary} className="mt-4">
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
