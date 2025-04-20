"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createAdminUser } from "@/lib/firebase/auth"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createAdminUser(email, password, name)

      toast({
        title: "Admin user created successfully",
        description: "You can now login with these credentials",
      })

      router.push("/login")
    } catch (error: any) {
      console.error("Signup error:", error)

      // Handle specific Firebase errors
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? "This email is already registered. Please use a different email or try logging in."
        : "An error occurred while creating the admin user.";

      toast({
        variant: "destructive",
        title: "Signup failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0d14] p-4">
      <Card className="w-full max-w-md bg-[#0f1219] border-border/40">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Admin User</CardTitle>
          <CardDescription>Enter details to create an admin account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#0a0d14] border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#0a0d14] border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#0a0d14] border-border/40"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Creating Admin..." : "Create Admin User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 