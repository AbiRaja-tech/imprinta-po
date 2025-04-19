"use client"

import { useState } from "react"
import { Menu, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AppSidebar } from "@/components/app-sidebar"

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b border-border/40 bg-[#0f1219]">
      <div className="flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 mr-2">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold">ImprintaPO</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[250px]">
          <AppSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
