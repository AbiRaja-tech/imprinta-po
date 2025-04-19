"use client"

import { useEffect, useState } from "react"
import { getSuppliers, Supplier } from "@/lib/firebase/suppliers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface SupplierSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export function SupplierSelect({ value, onValueChange }: SupplierSelectProps) {
  const [suppliers, setSuppliers] = useState<(Supplier & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        console.log('Fetching active suppliers...')
        
        // Fetch only active suppliers
        const activeSuppliers = await getSuppliers({ status: "Active" })
        console.log('Active suppliers:', activeSuppliers)

        if (activeSuppliers.length === 0) {
          toast({
            title: "No Active Suppliers",
            description: "Please add or activate suppliers before creating a purchase order.",
          })
        }

        setSuppliers(activeSuppliers)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load suppliers. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [toast])

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-[#0a0d14] border-border/40">
        <SelectValue placeholder="Select a supplier" />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            Loading suppliers...
          </SelectItem>
        ) : suppliers.length === 0 ? (
          <SelectItem value="none" disabled>
            No active suppliers found. Please add suppliers first.
          </SelectItem>
        ) : (
          suppliers.map((supplier) => (
            <SelectItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
} 