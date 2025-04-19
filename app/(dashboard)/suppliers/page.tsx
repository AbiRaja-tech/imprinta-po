import { Metadata } from "next"
import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Suppliers | ImprintaPO",
  description: "Manage your supplier information and contacts.",
}

export default function SuppliersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground">
            Manage your supplier information and contacts.
          </p>
        </div>
        <Button asChild>
          <Link href="/suppliers/add">
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Link>
        </Button>
      </div>
      <SuppliersTable />
    </div>
  )
}
