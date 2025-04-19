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
    <div className="bg-[#0f1219] rounded-lg border border-border/40">
      <div className="p-4 border-b border-border/40">
        <h2 className="text-lg font-semibold">Recent Purchase Orders</h2>
        <p className="text-sm text-muted-foreground mt-1">Your most recent purchase orders across all suppliers.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-muted/5">
              <th className="text-left text-xs font-medium text-muted-foreground p-3">PO Number</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Supplier</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Total</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Project</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentPOs.map((po) => (
              <tr key={po.id} className="border-b border-border/40 hover:bg-muted/5">
                <td className="p-3 text-sm font-medium">{po.poNumber}</td>
                <td className="p-3 text-sm">{po.supplier}</td>
                <td className="p-3 text-sm">{po.date.toLocaleDateString()}</td>
                <td className="p-3 text-sm">{getStatusBadge(po.status)}</td>
                <td className="p-3 text-sm font-medium">${po.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="p-3 text-sm max-w-[200px] truncate" title={po.project}>
                  {po.project}
                </td>
                <td className="p-3 text-right">
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
  )
}
