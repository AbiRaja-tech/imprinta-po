"use client"

import { useEffect, useState } from "react"
import { ItemType, getTypes, deleteType } from "@/lib/firebase/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { EditTypeDialog } from "./edit-type-dialog"
import { toast } from "sonner"

export function TypesTable() {
  const [types, setTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState<ItemType | null>(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const fetchedTypes = await getTypes();
      setTypes(fetchedTypes);
    } catch (error) {
      toast.error("Failed to fetch types");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteType(id);
      toast.success("Type deleted successfully");
      fetchTypes();
    } catch (error) {
      toast.error("Failed to delete type");
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading types...</div>;
  }

  if (types.length === 0) {
    return <div className="text-center p-4">No types found. Add your first type!</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell>{type.description || "-"}</TableCell>
                <TableCell>{type.updatedAt.toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingType(type)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(type.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditTypeDialog
        type={editingType}
        open={!!editingType}
        onOpenChange={(open) => !open && setEditingType(null)}
        onSuccess={() => {
          setEditingType(null);
          fetchTypes();
        }}
      />
    </>
  );
} 