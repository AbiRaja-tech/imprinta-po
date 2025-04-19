"use client"

import { EditPurchaseOrderForm } from "@/components/purchase-orders/edit-purchase-order-form"

interface EditPurchaseOrderPageProps {
  params: {
    id: string
  }
}

export default function EditPurchaseOrderPage({ params }: EditPurchaseOrderPageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Purchase Order</h2>
        <p className="text-muted-foreground">
          Update the details of your purchase order.
        </p>
      </div>
      <EditPurchaseOrderForm orderId={params.id} />
    </div>
  )
} 