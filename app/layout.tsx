import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider as AuthContextProvider } from "@/hooks/use-auth"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ImprintaPO - Purchase Order Management",
  description: "Purchase Order Management System for printing companies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthContextProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'