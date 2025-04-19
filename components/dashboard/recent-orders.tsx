"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRecentPurchaseOrders } from "@/lib/firebase/dashboard"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  status: string
  totalAmount: number
  createdAt: Date
}

const statusColors = {
  Draft: "bg-blue-500/20 text-blue-500",
  Sent: "bg-purple-500/20 text-purple-500",
  Pending: "bg-orange-500/20 text-orange-500",
  Received: "bg-green-500/20 text-green-500",
  Closed: "bg-gray-500/20 text-gray-500",
}

export function RecentOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const data = await getRecentPurchaseOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching recent orders:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load recent orders.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [toast])

  return (
    <Card className="bg-[#0f1219] border-border/40">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            ))
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent purchase orders found.
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{order.poNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.supplier}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(order.totalAmount)}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 