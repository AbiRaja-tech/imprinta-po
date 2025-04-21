"use client"

import { StatusCards } from "@/components/dashboard/status-cards"
import { RecentPurchaseOrders } from "@/components/dashboard/recent-purchase-orders"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('[DashboardPage] Page mounted', {
      loading,
      isAuthenticated
    });
  }, [loading, isAuthenticated]);

  console.log('[DashboardPage] Rendering dashboard page');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your purchase orders and suppliers.
          </p>
        </div>
        <Button asChild>
          <Link href="/purchase-orders/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Purchase Order
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCards />
      </div>

      <div className="min-w-0 overflow-hidden">
        <RecentPurchaseOrders />
      </div>
    </div>
  )
} 