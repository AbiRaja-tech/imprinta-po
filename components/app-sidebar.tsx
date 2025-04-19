"use client"

import type React from "react"

import { BarChart3, FileText, Home, Package, Settings, Truck, Users, LogOut, Tag } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-accent-foreground",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="hidden md:flex w-[220px] border-r border-border/40 flex-col bg-[#0f1219]">
      <div className="p-4 border-b border-border/40 flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold ml-2">ImprintaPO</span>
      </div>

      <div className="px-2 py-4">
        <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Navigation</p>
        <nav className="space-y-1">
          <NavItem href="/dashboard" icon={Home} label="Dashboard" active={pathname === "/dashboard"} />
          <NavItem
            href="/purchase-orders"
            icon={FileText}
            label="Purchase Orders"
            active={pathname.includes("/purchase-orders")}
          />
          <NavItem href="/suppliers" icon={Truck} label="Suppliers" active={pathname.includes("/suppliers")} />
          <NavItem href="/types" icon={Tag} label="Types" active={pathname.includes("/types")} />
          <NavItem href="/inventory" icon={Package} label="Inventory" active={pathname.includes("/inventory")} />
          <NavItem href="/reports" icon={BarChart3} label="Reports" active={pathname.includes("/reports")} />
        </nav>
      </div>

      <div className="px-2 py-4 mt-2">
        <p className="px-4 text-xs font-medium text-muted-foreground mb-2">Administration</p>
        <nav className="space-y-1">
          <NavItem href="/users" icon={Users} label="Users" active={pathname.includes("/users")} />
          <NavItem href="/settings" icon={Settings} label="Settings" active={pathname.includes("/settings")} />
          <Button
            variant="ghost"
            className="w-full justify-start px-3 text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            onClick={() => logout()}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      <div className="mt-auto border-t border-border/40 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
            <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-full w-full object-cover" />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-muted-foreground">{user?.email || "admin@imprinta.com"}</p>
          </div>
          <div className="ml-auto flex">
            <ModeToggle className="mr-1" />
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
