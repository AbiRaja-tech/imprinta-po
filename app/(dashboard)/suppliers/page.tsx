import { SuppliersTable } from "@/components/suppliers/suppliers-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SuppliersPage() {
  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage your supplier information and contacts.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div>
        <SuppliersTable />
      </div>
    </div>
  )
}
