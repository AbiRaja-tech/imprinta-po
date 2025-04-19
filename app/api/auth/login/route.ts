import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// In a real app, this would be stored in a database
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@imprinta.com",
    password: "password", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "2",
    name: "Staff User",
    email: "staff@imprinta.com",
    password: "password", // In a real app, this would be hashed
    role: "staff",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user by email
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token
    const token = sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" },
    )

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
