import { PurchaseOrdersTable } from "@/components/purchase-orders/purchase-orders-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function PurchaseOrdersPage() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground mt-1">Create and manage your purchase orders.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/purchase-orders/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Link>
        </Button>
      </div>

      <div>
        <PurchaseOrdersTable />
      </div>
    </div>
  )
}
