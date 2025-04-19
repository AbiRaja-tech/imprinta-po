"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Mail, MoreHorizontal, Pencil, Copy, Trash, Search, FileDown } from "lucide-react"
import Link from "next/link"

// Mock data for purchase orders
const purchaseOrders = [
  {
    id: "PRINT-PO-2025-001",
    supplier: "XYZ Paper Suppliers",
    date: "2025-04-10",
    status: "Sent",
    total: "$1,250.00",
    project: "Magazine Print April 2025",
    itemType: "Paper",
  },
  {
    id: "PRINT-PO-2025-002",
    supplier: "Ink Masters Co.",
    date: "2025-04-12",
    status: "Draft",
    total: "$780.50",
    project: "Business Cards Batch",
    itemType: "Ink",
  },
  {
    id: "PRINT-PO-2025-003",
    supplier: "Premium Packaging Ltd.",
    date: "2025-04-14",
    status: "Received",
    total: "$2,340.75",
    project: "Product Catalog Boxes",
    itemType: "Packaging",
  },
  {
    id: "PRINT-PO-2025-004",
    supplier: "Machine Parts Inc.",
    date: "2025-04-15",
    status: "Pending",
    total: "$4,500.00",
    project: "Printer Maintenance Parts",
    itemType: "Machinery",
  },
  {
    id: "PRINT-PO-2025-005",
    supplier: "Global Print Services",
    date: "2025-04-16",
    status: "Sent",
    total: "$3,200.00",
    project: "Outsourced Brochure Printing",
    itemType: "Outsourced Print",
  },
  {
    id: "PRINT-PO-2025-006",
    supplier: "XYZ Paper Suppliers",
    date: "2025-04-17",
    status: "Draft",
    total: "$950.25",
    project: "Newsletter Paper Stock",
    itemType: "Paper",
  },
  {
    id: "PRINT-PO-2025-007",
    supplier: "Ink Masters Co.",
    date: "2025-04-18",
    status: "Closed",
    total: "$1,120.00",
    project: "Special Edition Prints",
    itemType: "Ink",
  },
  {
    id: "PRINT-PO-2025-008",
    supplier: "Premium Packaging Ltd.",
    date: "2025-04-19",
    status: "Received",
    total: "$3,450.50",
    project: "Book Cover Materials",
    itemType: "Packaging",
  },
  {
    id: "PRINT-PO-2025-009",
    supplier: "Machine Parts Inc.",
    date: "2025-04-20",
    status: "Pending",
    total: "$2,780.00",
    project: "Binding Machine Repair",
    itemType: "Machinery",
  },
  {
    id: "PRINT-PO-2025-010",
    supplier: "Global Print Services",
    date: "2025-04-21",
    status: "Sent",
    total: "$5,600.00",
    project: "Annual Report Printing",
    itemType: "Outsourced Print",
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

export function PurchaseOrdersTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [itemTypeFilter, setItemTypeFilter] = useState("all")
  const [supplierFilter, setSupplierFilter] = useState("all")

  // Get unique suppliers for filter dropdown
  const suppliers = Array.from(new Set(purchaseOrders.map((po) => po.supplier)))

  // Filter purchase orders based on search term and filters
  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.project.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || po.status === statusFilter
    const matchesItemType = itemTypeFilter === "all" || po.itemType === itemTypeFilter
    const matchesSupplier = supplierFilter === "all" || po.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesItemType && matchesSupplier
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search purchase orders..."
              className="pl-9 bg-[#0f1219] border-border/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row md:max-w-[60%]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#0f1219] border-border/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
            <SelectTrigger className="bg-[#0f1219] border-border/40">
              <SelectValue placeholder="Item Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Item Types</SelectItem>
              <SelectItem value="Paper">Paper</SelectItem>
              <SelectItem value="Ink">Ink</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Machinery">Machinery</SelectItem>
              <SelectItem value="Outsourced Print">Outsourced Print</SelectItem>
            </SelectContent>
          </Select>

          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="bg-[#0f1219] border-border/40">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="shrink-0 border-border/40">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-border/40">
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
              {filteredPOs.length > 0 ? (
                filteredPOs.map((po) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/purchase-orders/${po.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/purchase-orders/${po.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="h-24 text-center text-muted-foreground">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
