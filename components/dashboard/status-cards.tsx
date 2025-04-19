import type React from "react"
import { FileText, Send, Clock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  count: number
  description: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
}

function StatusCard({ title, count, description, icon: Icon, iconColor }: StatusCardProps) {
  return (
    <div className="bg-[#0f1219] rounded-lg p-4 border border-border/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={cn("h-4 w-4", iconColor || "text-muted-foreground")} />
      </div>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

export function StatusCards() {
  return (
    <>
      <StatusCard
        title="Draft"
        count={12}
        description="Purchase orders in draft"
        icon={FileText}
        iconColor="text-blue-400"
      />
      <StatusCard
        title="Sent"
        count={24}
        description="Purchase orders sent to suppliers"
        icon={Send}
        iconColor="text-indigo-400"
      />
      <StatusCard
        title="Pending"
        count={7}
        description="Awaiting delivery or partial"
        icon={Clock}
        iconColor="text-amber-400"
      />
      <StatusCard
        title="Completed"
        count={42}
        description="Fulfilled purchase orders"
        icon={CheckCircle}
        iconColor="text-emerald-400"
      />
    </>
  )
}
