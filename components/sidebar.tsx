"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import {
  BarChart,
  Box,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isAdmin, signOut } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "Purchase Orders",
      icon: FileText,
      href: "/purchase-orders",
      color: "text-violet-500",
    },
    {
      label: "Suppliers",
      icon: Box,
      href: "/suppliers",
      color: "text-pink-700",
    },
    {
      label: "Types",
      icon: Package,
      href: "/types",
      color: "text-orange-500",
    },
    {
      label: "Inventory",
      icon: Box,
      href: "/inventory",
      color: "text-emerald-500",
    },
    // Admin only routes
    ...(isAdmin() ? [
      {
        label: "Reports",
        icon: BarChart,
        href: "/reports",
        color: "text-green-700",
      },
      {
        label: "Users",
        icon: Users,
        href: "/users",
        color: "text-blue-700",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
      },
    ] : []),
  ]

  return (
    <div className={cn("pb-12 w-64 bg-[#0f1219] border-r border-border/40", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              ImprintaPO
            </h2>
          </Link>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-[#0a0d14] rounded-lg transition",
                  pathname === route.href ? "bg-[#0a0d14]" : "transparent",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                  {route.label}
                </div>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-[#0a0d14] rounded-lg transition"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-3 text-red-500" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 