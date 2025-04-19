import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

// Mock data for recent purchase orders
const recentPOs = [
  {
    id: "PRINT-PO-2025-001",
    supplier: "XYZ Paper Suppliers",
    date: "2025-04-10",
    status: "Sent",
    total: "$1,250.00",
    project: "Magazine Print April 2025",
  },
  {
    id: "PRINT-PO-2025-002",
    supplier: "Ink Masters Co.",
    date: "2025-04-12",
    status: "Draft",
    total: "$780.50",
    project: "Business Cards Batch",
  },
  {
    id: "PRINT-PO-2025-003",
    supplier: "Premium Packaging Ltd.",
    date: "2025-04-14",
    status: "Received",
    total: "$2,340.75",
    project: "Product Catalog Boxes",
  },
  {
    id: "PRINT-PO-2025-004",
    supplier: "Machine Parts Inc.",
    date: "2025-04-15",
    status: "Pending",
    total: "$4,500.00",
    project: "Printer Maintenance Parts",
  },
  {
    id: "PRINT-PO-2025-005",
    supplier: "Global Print Services",
    date: "2025-04-16",
    status: "Sent",
    total: "$3,200.00",
    project: "Outsourced Brochure Printing",
  },
]

// Helper function to get badge variant based on status
function getStatusBadge(status: string) {
  switch (status) {
    case "Draft":
      return (
        <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800">
          Draft
        </Badge>
      )
    case "Sent":
      return (
        <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-800">
          Sent
        </Badge>
      )
    case "Pending":
      return (
        <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800">
          Pending
        </Badge>
      )
    case "Received":
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
                <td className="p-3 text-sm font-medium">{po.id}</td>
                <td className="p-3 text-sm">{po.supplier}</td>
                <td className="p-3 text-sm">{po.date}</td>
                <td className="p-3 text-sm">{getStatusBadge(po.status)}</td>
                <td className="p-3 text-sm font-medium">{po.total}</td>
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
