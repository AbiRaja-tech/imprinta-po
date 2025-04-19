import { Metadata } from "next"
import { AddSupplierForm } from "@/components/suppliers/add-supplier-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Add Supplier | ImprintaPO",
  description: "Add a new supplier to your system.",
}

export default function AddSupplierPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-4">
        <Button variant="ghost" asChild className="h-8 w-8">
          <Link href="/suppliers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add Supplier</h2>
          <p className="text-muted-foreground">
            Add a new supplier to your system.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AddSupplierForm />
        </div>
      </div>
    </div>
  )
} 