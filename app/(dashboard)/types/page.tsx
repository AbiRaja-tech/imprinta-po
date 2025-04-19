"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TypesTable } from "@/components/types/types-table"
import { useState } from "react"
import { AddTypeDialog } from "@/components/types/add-type-dialog"

export default function TypesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Item Types</h1>
          <p className="text-muted-foreground mt-1">Manage your item types and their tax rates.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Type
        </Button>
      </div>

      <TypesTable />
      <AddTypeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
} 