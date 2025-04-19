import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0d14]">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <MobileHeader />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
