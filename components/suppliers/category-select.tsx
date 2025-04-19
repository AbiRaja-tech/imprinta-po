import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { getTypes } from "@/lib/firebase/types"
import { ItemType } from "@/lib/firebase/types"

interface CategorySelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function CategorySelect({ value, onValueChange, className }: CategorySelectProps) {
  const [types, setTypes] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const fetchedTypes = await getTypes()
        setTypes(fetchedTypes)
      } catch (error) {
        console.error("Error fetching types:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTypes()
  }, [])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="Loading categories..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {types.map((type) => (
          <SelectItem key={type.id} value={type.id || ''}>
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 