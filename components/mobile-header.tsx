"use client"

import { useState } from "react"
import { Menu, FileText, Home, Building2, Package2, Boxes, Settings, LogOut, BarChart2, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { handleLogout } from "@/components/auth/logout"

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  const onLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    await handleLogout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-14 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-14 items-center border-b px-4">
              <span className="font-semibold">Imprinta PO</span>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/purchase-orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <FileText className="h-4 w-4" />
                <span>Purchase Orders</span>
              </Link>
              <Link
                href="/suppliers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Building2 className="h-4 w-4" />
                <span>Suppliers</span>
              </Link>
              <Link
                href="/types"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Boxes className="h-4 w-4" />
                <span>Types</span>
              </Link>
              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                <Package2 className="h-4 w-4" />
                <span>Inventory</span>
              </Link>
              <div className="mt-4 border-t border-border/40 pt-4">
                <Link
                  href="/dashboard/users"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/reports"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Reports</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={onLogoutClick}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex-1">
          <span className="font-semibold">Imprinta PO</span>
        </div>
      </div>
    </header>
  )
}
