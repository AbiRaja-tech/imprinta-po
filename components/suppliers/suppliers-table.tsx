"use client"

import { useEffect, useState } from "react"
import { getSuppliers, Supplier } from "@/lib/firebase/suppliers"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

const categories = [
  "Paper",
  "Ink",
  "Packaging",
  "Machinery",
  "Outsourced Print",
  "Other",
]

export function SuppliersTable() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<Supplier["status"] | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const filters: Parameters<typeof getSuppliers>[0] = {}
      
      if (statusFilter && statusFilter !== "all") {
        filters.status = statusFilter
      }
      if (categoryFilter && categoryFilter !== "all") {
        filters.category = categoryFilter
      }

      const data = await getSuppliers(filters)
      
      // Apply search filter client-side
      const filteredSuppliers = searchQuery
        ? data.filter(
            supplier =>
              supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              supplier.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : data

      setSuppliers(filteredSuppliers)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch suppliers. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [statusFilter, categoryFilter, searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-[#0a0d14] border-border/40"
          />
          <Select 
            value={statusFilter} 
            onValueChange={(value: Supplier["status"] | "all") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px] bg-[#0a0d14] border-border/40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-[#0a0d14] border-border/40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-[#0f1219]">
                <th className="px-4 py-3 text-left text-sm font-medium">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    Loading suppliers...
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border/40">
                    <td className="px-4 py-3 text-sm">{supplier.name}</td>
                    <td className="px-4 py-3 text-sm">{supplier.contactName}</td>
                    <td className="px-4 py-3 text-sm">{supplier.email}</td>
                    <td className="px-4 py-3 text-sm">{supplier.phone}</td>
                    <td className="px-4 py-3 text-sm">{supplier.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          supplier.status === "Active"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
