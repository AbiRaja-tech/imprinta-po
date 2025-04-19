"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats, DashboardStats } from "@/lib/firebase/dashboard"
import { useToast } from "@/components/ui/use-toast"
import { FileText, Send, Clock, CheckCircle } from "lucide-react"

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    draft: 0,
    sent: 0,
    pending: 0,
    completed: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard statistics.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  const cards = [
    {
      title: "Draft",
      value: stats.draft,
      description: "Purchase orders in draft",
      icon: FileText,
      className: "text-blue-500",
    },
    {
      title: "Sent",
      value: stats.sent,
      description: "Purchase orders sent to suppliers",
      icon: Send,
      className: "text-purple-500",
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Awaiting delivery or partial",
      icon: Clock,
      className: "text-orange-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      description: "Fulfilled purchase orders",
      icon: CheckCircle,
      className: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="bg-[#0f1219] border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "-" : card.value}
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 