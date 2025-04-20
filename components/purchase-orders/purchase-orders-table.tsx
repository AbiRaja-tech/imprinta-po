"use client"

import { useEffect, useState } from "react"
import { getPurchaseOrders, PurchaseOrder, deletePurchaseOrder } from "@/lib/firebase/purchase-orders"
import { getSuppliers, Supplier } from "@/lib/firebase/suppliers"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Status badge colors
const statusColors = {
  Draft: "bg-blue-500/20 text-blue-500",
  Sent: "bg-purple-500/20 text-purple-500",
  Received: "bg-green-500/20 text-green-500",
  Pending: "bg-orange-500/20 text-orange-500",
  Closed: "bg-gray-500/20 text-gray-500",
}

export function PurchaseOrdersTable() {
  const router = useRouter()
  const [purchaseOrders, setPurchaseOrders] = useState<(PurchaseOrder & { id: string })[]>([])
  const [suppliers, setSuppliers] = useState<(Supplier & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers({ status: "Active" })
        setSuppliers(data)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load suppliers. Please try again.",
        })
      }
    }

    fetchSuppliers()
  }, [toast])

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true)
      const filters: Parameters<typeof getPurchaseOrders>[0] = {}
      
      if (statusFilter && statusFilter !== "all") {
        filters.status = statusFilter as PurchaseOrder["status"]
      }
      if (supplierFilter && supplierFilter !== "all") {
        filters.supplier = supplierFilter
      }

      const orders = await getPurchaseOrders(filters)
      
      // Apply search filter client-side
      const filteredOrders = searchQuery
        ? orders.filter(
            order =>
              order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.projectRef.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : orders

      setPurchaseOrders(filteredOrders)
    } catch (error) {
      console.error("Error fetching purchase orders:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch purchase orders. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchaseOrders()
  }, [statusFilter, supplierFilter, searchQuery])

  const handleDelete = async (orderId: string) => {
    setSelectedOrderId(orderId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedOrderId) return

    try {
      await deletePurchaseOrder(selectedOrderId)
      toast({
        title: "Success",
        description: "Purchase order deleted successfully.",
      })
      fetchPurchaseOrders() // Refresh the list
    } catch (error) {
      console.error("Error deleting purchase order:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete purchase order. Please try again.",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedOrderId(null)
    }
  }

  const handleUpdate = (orderId: string) => {
    router.push(`/purchase-orders/edit/${orderId}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search PO number or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-[#0a0d14] border-border/40"
          />
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px] bg-[#0a0d14] border-border/40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Received">Received</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={supplierFilter} onValueChange={setSupplierFilter}>
            <SelectTrigger className="w-[180px] bg-[#0a0d14] border-border/40">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-[#0f1219]">
              <tr>
                <th className="sticky left-0 z-20 bg-[#0f1219] px-4 py-3.5 text-left text-sm font-medium text-muted-foreground border-r border-border/40 min-w-[200px]">
                  PO Number
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[150px]">
                  Supplier
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[120px]">
                  Date
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[120px]">
                  Status
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[150px]">
                  Total
                </th>
                <th className="px-4 py-3.5 text-left text-sm font-medium text-muted-foreground min-w-[200px]">
                  Project
                </th>
                <th className="px-4 py-3.5 text-center text-sm font-medium text-muted-foreground min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : purchaseOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                purchaseOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/5">
                    <td className="sticky left-0 z-20 bg-[#0f1219] whitespace-nowrap px-4 py-4 text-sm font-medium border-r border-border/40">
                      {order.poNumber}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {suppliers.find((s) => s.id === order.supplier)?.name || 'Unknown Supplier'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      {format(order.orderDate, "yyyy-MM-dd")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm">{order.projectRef}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleUpdate(order.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
