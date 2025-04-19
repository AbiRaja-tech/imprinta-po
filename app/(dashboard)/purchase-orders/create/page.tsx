"use client"

import { CreatePurchaseOrderForm } from "@/components/purchase-orders/create-purchase-order-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CreatePurchaseOrderPage() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/purchase-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Purchase Order</h1>
          <p className="text-muted-foreground mt-1">Create a new purchase order for your suppliers.</p>
        </div>
      </div>

      <div className="grid gap-6">
        <CreatePurchaseOrderForm />
      </div>
    </div>
  )
}
