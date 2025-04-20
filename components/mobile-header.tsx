"use client"

import { useState } from "react"
import { Menu, FileText, Home, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"

export function MobileHeader() {
  const [open, setOpen] = useState(false)

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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/purchase-orders"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Purchase Orders
              </Link>
              <Link
                href="/suppliers"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setOpen(false)}
              >
                <Building2 className="h-4 w-4" />
                Suppliers
              </Link>
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
