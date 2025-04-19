"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTypes, ItemType } from "@/lib/firebase/types"

interface TypeSelectProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function TypeSelect({ value, onValueChange, className }: TypeSelectProps) {
  const [types, setTypes] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTypes() {
      try {
        const fetchedTypes = await getTypes()
        setTypes(fetchedTypes)
      } catch (error) {
        console.error('Error fetching types:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTypes()
  }, [])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={loading}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Loading types..." : "Select type"} />
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