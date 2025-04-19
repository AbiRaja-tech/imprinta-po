"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, Send, Clock, CheckCircle, ChevronDown } from "lucide-react"

interface PurchaseOrderStatusSelectProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  disabled?: boolean
}

export function PurchaseOrderStatusSelect({
  currentStatus,
  onStatusChange,
  disabled = false,
}: PurchaseOrderStatusSelectProps) {
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "Sent":
        return <Send className="h-4 w-4 text-indigo-400" />
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-400" />
      case "Received":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Get status text color
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "text-blue-400"
      case "Sent":
        return "text-indigo-400"
      case "Pending":
        return "text-amber-400"
      case "Received":
        return "text-emerald-400"
      default:
        return ""
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-border/40 min-w-[130px]" disabled={disabled}>
          <span className="flex items-center">
            {getStatusIcon(currentStatus)}
            <span className={`mx-2 ${getStatusTextColor(currentStatus)}`}>{currentStatus}</span>
          </span>
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onStatusChange("Draft")} className="flex items-center">
          <FileText className="h-4 w-4 text-blue-400 mr-2" />
          <span>Draft</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Sent")} className="flex items-center">
          <Send className="h-4 w-4 text-indigo-400 mr-2" />
          <span>Sent</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Pending")} className="flex items-center">
          <Clock className="h-4 w-4 text-amber-400 mr-2" />
          <span>Pending</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange("Received")} className="flex items-center">
          <CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />
          <span>Received</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
