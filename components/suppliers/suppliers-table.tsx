"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Pencil, Trash, Mail, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for suppliers
const suppliers = [
  {
    id: "1",
    name: "XYZ Paper Suppliers",
    contactName: "John Smith",
    email: "john@xyzpaper.com",
    phone: "+1 (555) 123-4567",
    address: "123 Paper Mill Rd, Papertown, PT 12345",
    category: "Paper",
    status: "Active",
  },
  {
    id: "2",
    name: "Ink Masters Co.",
    contactName: "Sarah Johnson",
    email: "sarah@inkmasters.com",
    phone: "+1 (555) 234-5678",
    address: "456 Ink Blvd, Colorville, CV 23456",
    category: "Ink",
    status: "Active",
  },
  {
    id: "3",
    name: "Premium Packaging Ltd.",
    contactName: "Michael Brown",
    email: "michael@premiumpackaging.com",
    phone: "+1 (555) 345-6789",
    address: "789 Box Street, Wraptown, WT 34567",
    category: "Packaging",
    status: "Active",
  },
  {
    id: "4",
    name: "Machine Parts Inc.",
    contactName: "Emily Davis",
    email: "emily@machineparts.com",
    phone: "+1 (555) 456-7890",
    address: "101 Gear Avenue, Mechanicsburg, MB 45678",
    category: "Machinery",
    status: "Inactive",
  },
  {
    id: "5",
    name: "Global Print Services",
    contactName: "David Wilson",
    email: "david@globalprint.com",
    phone: "+1 (555) 567-8901",
    address: "202 Press Lane, Printville, PV 56789",
    category: "Outsourced Print",
    status: "Active",
  },
  {
    id: "6",
    name: "Eco Paper Solutions",
    contactName: "Lisa Green",
    email: "lisa@ecopaper.com",
    phone: "+1 (555) 678-9012",
    address: "303 Recycled Road, Greentown, GT 67890",
    category: "Paper",
    status: "Active",
  },
  {
    id: "7",
    name: "Specialty Inks Ltd.",
    contactName: "Robert Chen",
    email: "robert@specialtyinks.com",
    phone: "+1 (555) 789-0123",
    address: "404 Pigment Place, Inkville, IV 78901",
    category: "Ink",
    status: "Inactive",
  },
]

export function SuppliersTable() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers..."
            className="pl-9 bg-[#0f1219] border-border/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-border/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/5">
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Supplier</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Contact</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Phone</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Category</th>
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="p-3 text-sm font-medium">{supplier.name}</td>
                    <td className="p-3 text-sm">{supplier.contactName}</td>
                    <td className="p-3 text-sm">{supplier.email}</td>
                    <td className="p-3 text-sm">{supplier.phone}</td>
                    <td className="p-3 text-sm">{supplier.category}</td>
                    <td className="p-3 text-sm">
                      {supplier.status === "Active" ? (
                        <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-950/30 text-slate-400 border-slate-800">
                          Inactive
                        </Badge>
                      )}
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
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View POs
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
                    No suppliers found.
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
