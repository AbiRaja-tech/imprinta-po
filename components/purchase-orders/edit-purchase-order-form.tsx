"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPurchaseOrder, updatePurchaseOrder, PurchaseOrder } from "@/lib/firebase/purchase-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditPurchaseOrderFormProps {
  orderId: string
}

export function EditPurchaseOrderForm({ orderId }: EditPurchaseOrderFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<Omit<PurchaseOrder, 'createdAt'>>({
    poNumber: "",
    projectRef: "",
    orderDate: new Date(),
    deliveryDate: new Date(),
    supplier: "",
    lineItems: [],
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    status: "Draft",
  })

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      try {
        const order = await getPurchaseOrder(orderId)
        const { createdAt, ...orderData } = order
        setFormData(orderData)
      } catch (error) {
        console.error("Error fetching purchase order:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchase order details.",
        })
        router.push("/purchase-orders")
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseOrder()
  }, [orderId, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updatePurchaseOrder(orderId, formData)
      toast({
        title: "Success",
        description: "Purchase order has been updated successfully.",
      })
      router.push("/purchase-orders")
    } catch (error) {
      console.error("Error updating purchase order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update purchase order. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading purchase order details...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="poNumber">PO Number</Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectRef">Project Reference</Label>
            <Input
              id="projectRef"
              value={formData.projectRef}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="orderDate">Order Date</Label>
            <Input
              id="orderDate"
              value={format(formData.orderDate, "yyyy-MM-dd")}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate" className="font-medium text-primary">Delivery Date *</Label>
            <Input
              id="deliveryDate"
              name="deliveryDate"
              type="date"
              value={format(formData.deliveryDate, "yyyy-MM-dd")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryDate: new Date(e.target.value),
                }))
              }
              required
              className="border-primary/50"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Input
              value={formData.supplier}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="font-medium text-primary">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: PurchaseOrder["status"]) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="border-primary/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Subtotal</Label>
            <Input
              value={`₹${formData.subtotal.toFixed(2)}`}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label>Tax Amount</Label>
            <Input
              value={`₹${formData.taxAmount.toFixed(2)}`}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label>Total Amount</Label>
            <Input
              value={`₹${formData.totalAmount.toFixed(2)}`}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/purchase-orders")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Purchase Order"}
        </Button>
      </div>
    </form>
  )
} 