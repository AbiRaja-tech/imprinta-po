"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ChevronRight, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/firebase/dashboard"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  console.log('[RecentPurchaseOrders] Component mounted');
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentPurchaseOrder[]>([])

  useEffect(() => {
    const fetchRecentOrders = async () => {
      console.log('[RecentPurchaseOrders] Starting to fetch data...');
      try {
        setError(null)
        const stats = await getDashboardStats()
        console.log('[RecentPurchaseOrders] Received stats:', stats);
        
        if (!stats?.recentPurchaseOrders) {
          console.error('[RecentPurchaseOrders] No recentPurchaseOrders in stats:', stats);
          throw new Error('Failed to fetch recent purchase orders')
        }
        console.log('[RecentPurchaseOrders] Setting orders:', stats.recentPurchaseOrders);
        setRecentOrders(stats.recentPurchaseOrders)
      } catch (error) {
        console.error('[RecentPurchaseOrders] Error details:', error);
        setError('Failed to load recent purchase orders. Please try again later.')
      } finally {
        console.log('[RecentPurchaseOrders] Fetch completed, setting loading to false');
        setIsLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  console.log('[RecentPurchaseOrders] Current state:', { 
    isLoading, 
    error, 
    ordersCount: recentOrders.length,
    orders: recentOrders 
  });

  if (error) {
    console.log('[RecentPurchaseOrders] Rendering error state');
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
            <p className="text-sm text-muted-foreground">Latest purchase orders across all projects.</p>
          </div>
        </div>
        <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
          <p className="text-sm text-muted-foreground">Latest purchase orders across all projects.</p>
        </div>
        <Button variant="outline" asChild className="border-border hover:bg-accent">
          <Link href="/purchase-orders">View All</Link>
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-accent/5">
              <TableHead className="text-muted-foreground">PO Number</TableHead>
              <TableHead className="hidden sm:table-cell text-muted-foreground">Supplier</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground">Date</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground">Total</TableHead>
              <TableHead className="hidden xl:table-cell text-muted-foreground">Project</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <LoadingSpinner className="mx-auto h-6 w-6 text-primary" />
                </TableCell>
              </TableRow>
            ) : recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No recent purchase orders
                </TableCell>
              </TableRow>
            ) : (
              recentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-accent/5">
                  <TableCell className="font-medium">{order.poNumber}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.supplier}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(order.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(order.status)} 
                      className={cn(
                        getStatusBadgeClasses(order.status),
                        "font-medium"
                      )}
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
                      className="ml-auto hover:bg-accent"
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
