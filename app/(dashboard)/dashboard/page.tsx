import { StatusCards } from "@/components/dashboard/status-cards"
import { RecentPurchaseOrders } from "@/components/dashboard/recent-purchase-orders"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your purchase orders and procurement activities.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/purchase-orders/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatusCards />
      </div>

      <div>
        <RecentPurchaseOrders />
      </div>
    </div>
  )
}
