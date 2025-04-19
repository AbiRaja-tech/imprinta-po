"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for report table
const reportData = Array.from({ length: 50 }).map((_, i) => {
  const suppliers = [
    "XYZ Paper Suppliers",
    "Ink Masters Co.",
    "Premium Packaging Ltd.",
    "Machine Parts Inc.",
    "Global Print Services",
  ]
  const itemTypes = ["Paper", "Ink", "Packaging", "Machinery", "Outsourced Print"]
  const statuses = ["Draft", "Sent", "Pending", "Received", "Closed"]

  return {
    id: `PRINT-PO-2025-${String(i + 1).padStart(3, "0")}`,
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    itemType: itemTypes[Math.floor(Math.random() * itemTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    amount: (Math.random() * 5000 + 500).toFixed(2),
  }
})

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
    case "Closed":
      return (
        <Badge variant="outline" className="bg-slate-950/30 text-slate-400 border-slate-800">
          Closed
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function ReportTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search term
  const filteredData = reportData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search reports..."
          className="pl-9 bg-[#0f1219] border-border/40"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-border/40 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-muted/5">
              <th className="text-left text-xs font-medium text-muted-foreground p-3">PO Number</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Date</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Supplier</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Item Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
              <th className="text-right text-xs font-medium text-muted-foreground p-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id} className="border-b border-border/40 hover:bg-muted/5">
                  <td className="p-3 text-sm font-medium">{item.id}</td>
                  <td className="p-3 text-sm">{item.date}</td>
                  <td className="p-3 text-sm">{item.supplier}</td>
                  <td className="p-3 text-sm">{item.itemType}</td>
                  <td className="p-3 text-sm">{getStatusBadge(item.status)}</td>
                  <td className="p-3 text-sm font-medium text-right">${item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="h-24 text-center text-muted-foreground">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
            items
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 border-border/40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 border-border/40"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
