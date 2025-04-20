"use client"

import type React from "react"
import { useState } from "react"

import { BarChart3, FileText, Home, Package, Settings, Truck, Users, LogOut, Tag, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/app/(dashboard)/layout"

interface NavItemProps {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}

function NavItem({ href, icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { permissions, signOut } = useAuth()
  const router = useRouter()
  const { isCollapsed, setIsCollapsed } = useSidebar()

  const handleNavigation = async (path: string) => {
    console.log('Navigation requested:', { path, permissions });
    
    // Check permissions for protected routes
    if (path === '/users' && !permissions?.canManageUsers) {
      console.log('No users permission, staying on current page');
      return;
    }
    if (path === '/reports' && !permissions?.canViewReports) {
      console.log('No reports permission, staying on current page');
      return;
    }
    if (path === '/settings' && !permissions?.canManageSettings) {
      console.log('No settings permission, staying on current page');
      return;
    }
    
    // Only navigate if permissions allow
    console.log('Navigating to:', path);
    await router.push(path);
  }

  // Common navigation items for all users
  const commonNavItems: NavItemProps[] = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      active: pathname === "/dashboard",
      onClick: () => handleNavigation("/dashboard")
    },
    {
      href: "/purchase-orders",
      icon: FileText,
      label: "Purchase Orders",
      active: pathname.includes("/purchase-orders"),
      onClick: () => handleNavigation("/purchase-orders")
    },
    {
      href: "/suppliers",
      icon: Truck,
      label: "Suppliers",
      active: pathname.includes("/suppliers"),
      onClick: () => handleNavigation("/suppliers")
    },
    {
      href: "/types",
      icon: Tag,
      label: "Types",
      active: pathname.includes("/types"),
      onClick: () => handleNavigation("/types")
    },
    {
      href: "/inventory",
      icon: Package,
      label: "Inventory",
      active: pathname.includes("/inventory"),
      onClick: () => handleNavigation("/inventory")
    },
  ]

  // Admin-only navigation items - only show if user has permissions
  const adminNavItems: NavItemProps[] = !permissions ? [] : [
    ...(permissions.canManageUsers ? [{
      href: "/users",
      icon: Users,
      label: "Users",
      active: pathname.includes("/users"),
      onClick: () => handleNavigation("/users")
    }] : []),
    ...(permissions.canViewReports ? [{
      href: "/reports",
      icon: BarChart3,
      label: "Reports",
      active: pathname.includes("/reports"),
      onClick: () => handleNavigation("/reports")
    }] : []),
    ...(permissions.canManageSettings ? [{
      href: "/settings",
      icon: Settings,
      label: "Settings",
      active: pathname.includes("/settings"),
      onClick: () => handleNavigation("/settings")
    }] : [])
  ]

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 hidden md:flex flex-col border-r border-border/40 bg-[#0f1219] transition-all duration-300 z-40",
      isCollapsed ? "w-[60px]" : "w-[220px]"
    )}>
      <div className="flex h-14 items-center justify-between border-b border-border/40 px-2">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">ImprintaPO</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8 shrink-0", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-4">
          <div>
            <p className={cn(
              "px-2 text-xs font-medium text-muted-foreground mb-2 transition-opacity duration-200",
              isCollapsed && "opacity-0"
            )}>Navigation</p>
            <nav className="space-y-1">
              {commonNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all hover:text-accent-foreground",
                    item.active && "bg-accent text-accent-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
                  {!isCollapsed && item.label}
                </button>
              ))}
            </nav>
          </div>

          {adminNavItems.length > 0 && (
            <div>
              <p className={cn(
                "px-2 text-xs font-medium text-muted-foreground mb-2 transition-opacity duration-200",
                isCollapsed && "opacity-0"
              )}>Administration</p>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={item.onClick}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all hover:text-accent-foreground",
                      item.active && "bg-accent text-accent-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
                    {!isCollapsed && item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border/40 p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-red-500 hover:text-red-500 hover:bg-red-500/10",
            isCollapsed ? "justify-center px-0" : "justify-start"
          )}
          onClick={() => signOut()}
        >
          <LogOut className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
}
