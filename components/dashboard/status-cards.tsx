"use client"

import { FileText, Send, Clock, CheckCircle } from "lucide-react"
import { getDashboardStats } from "@/lib/firebase/dashboard"
import { useEffect, useState } from "react"

export function StatusCards() {
  const [stats, setStats] = useState({
    draft: 0,
    sent: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats({
          draft: dashboardStats.draft,
          sent: dashboardStats.sent,
          pending: dashboardStats.pending,
          completed: dashboardStats.completed
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="bg-[#0f1219] rounded-lg border border-border/40">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.draft}</p>
            <p className="text-sm text-muted-foreground">Purchase orders in draft</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-border/40">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Send className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.sent}</p>
            <p className="text-sm text-muted-foreground">Purchase orders sent to suppliers</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-border/40">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Awaiting delivery or partial</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-border/40">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Fulfilled purchase orders</p>
          </div>
        </div>
      </div>
    </>
  )
}
