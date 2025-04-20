"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "@/lib/firebase/dashboard"
import { useEffect, useState } from "react"

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
function getStatusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case "draft":
      return (
        <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800">
          Draft
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-800">
          Sent
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800">
          Pending
        </Badge>
      )
    case "received":
      return (
        <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-800">
          Received
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function RecentPurchaseOrders() {
  const [recentPOs, setRecentPOs] = useState<RecentPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPOs = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setRecentPOs(dashboardStats.recentPurchaseOrders);
      } catch (error) {
        console.error('Error fetching recent purchase orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPOs();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0f1219] rounded-lg border border-border/40 p-4">
        <p className="text-sm text-muted-foreground">Loading recent purchase orders...</p>
      </div>
    );
  }

  if (recentPOs.length === 0) {
    return (
      <div className="bg-[#0f1219] rounded-lg border border-border/40 p-4">
        <p className="text-sm text-muted-foreground">No recent purchase orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1219] rounded-lg flex flex-col mb-20 md:mb-0">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">Your most recent purchase orders across all suppliers.</p>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full border-collapse">
            <thead className="bg-[#0f1219]">
              <tr>
                <th scope="col" className="sticky left-0 z-20 bg-[#0f1219] px-4 py-3.5 text-left text-sm font-medium text-muted-foreground border-r border-border/40 min-w-[200px]">
                  PO Number
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[150px]">
                  Supplier
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[120px]">
                  Date
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[120px]">
                  Status
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[150px]">
                  Total
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[200px]">
                  Project
                </th>
                <th scope="col" className="relative px-4 py-3.5 min-w-[100px]">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recentPOs.map((po) => (
                <tr key={po.id} className="hover:bg-muted/5">
                  <td className="sticky left-0 z-20 bg-[#0f1219] whitespace-nowrap px-4 py-4 text-sm font-medium border-r border-border/40">
                    {po.poNumber}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    {po.supplier}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    {po.date instanceof Date && !isNaN(po.date.getTime())
                      ? new Intl.DateTimeFormat('en-IN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).format(po.date)
                      : 'Invalid Date'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm">
                    {getStatusBadge(po.status)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                    {typeof po.total === 'number' 
                      ? new Intl.NumberFormat('en-IN', { 
                          style: 'currency', 
                          currency: 'INR',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        }).format(po.total)
                      : '₹0.00'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm" title={po.project || 'N/A'}>
                    {po.project || 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <Link href={`/purchase-orders/${po.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
