"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/firebase/dashboard"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"

interface RecentPurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  date: Date
  status: string
  total: number
  project: string
}

// Helper function to get badge variant based on status
function getStatusBadgeVariant(status: string): "outline" {
  return "outline"
}

function getStatusBadgeClasses(status: string): string {
  switch (status?.toLowerCase()) {
    case "draft":
      return "bg-blue-950/30 text-blue-400 border-blue-800"
    case "sent":
      return "bg-indigo-950/30 text-indigo-400 border-indigo-800"
    case "pending":
      return "bg-amber-950/30 text-amber-400 border-amber-800"
    case "received":
      return "bg-emerald-950/30 text-emerald-400 border-emerald-800"
    default:
      return ""
  }
}

function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
}

export function RecentPurchaseOrders() {
  const [isLoading, setIsLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<RecentPurchaseOrder[]>([])

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const stats = await getDashboardStats()
        setRecentOrders(stats.recentPurchaseOrders || [])
      } catch (error) {
        console.error('Error fetching recent orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
          <p className="text-sm text-muted-foreground">Latest purchase orders across all projects.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/purchase-orders">View All</Link>
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead className="hidden sm:table-cell">Supplier</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Total</TableHead>
              <TableHead className="hidden xl:table-cell">Project</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <LoadingSpinner className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No recent purchase orders
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.poNumber}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.supplier}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(order.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(order.status)} 
                      className={getStatusBadgeClasses(order.status)}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">{order.project}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="ml-auto"
                    >
                      <Link href={`/purchase-orders/${order.id}`}>
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
