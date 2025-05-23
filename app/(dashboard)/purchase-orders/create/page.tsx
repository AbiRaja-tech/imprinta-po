import { Metadata } from "next"
import { CreatePurchaseOrderForm } from "@/components/purchase-orders/create-purchase-order-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Create Purchase Order | ImprintaPO",
  description: "Create a new purchase order for your suppliers.",
}

export default function CreatePurchaseOrderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-4">
        <Button variant="ghost" asChild className="h-8 w-8">
          <Link href="/purchase-orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Purchase Order</h2>
          <p className="text-muted-foreground">
            Create a new purchase order for your suppliers.
          </p>
        </div>
      </div>
      <CreatePurchaseOrderForm />
    </div>
  )
}
