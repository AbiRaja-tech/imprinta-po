"use client"

import { EditPurchaseOrderForm } from "@/components/purchase-orders/edit-purchase-order-form"
import { useParams } from "next/navigation"

export default function EditPurchaseOrderPage() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Purchase Order</h2>
        <p className="text-muted-foreground">
          Update the details of your purchase order.
        </p>
      </div>
      <EditPurchaseOrderForm orderId={id} />
    </div>
  )
} 