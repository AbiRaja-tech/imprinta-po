'use client';

import { StatusCards } from "@/components/dashboard/status-cards"
import { RecentPurchaseOrders } from "@/components/dashboard/recent-purchase-orders"
import { FirebaseProvider } from "@/components/providers/firebase-provider"

export function DashboardWrapper() {
  return (
    <FirebaseProvider>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCards />
        </div>

        <div className="overflow-hidden rounded-lg border border-border/40">
          <RecentPurchaseOrders />
        </div>
      </div>
    </FirebaseProvider>
  )
} 