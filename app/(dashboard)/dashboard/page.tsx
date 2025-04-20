import { StatusCards } from "@/components/dashboard/status-cards"
import { RecentPurchaseOrders } from "@/components/dashboard/recent-purchase-orders"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Overview of your purchase orders and procurement activities.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <Link href="/purchase-orders/create" className="flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards />
      </div>

      <div className="overflow-hidden rounded-lg border border-border/40">
        <RecentPurchaseOrders />
      </div>
    </div>
  )
}
