"use client"

import { FileText, Send, Clock, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { getDashboardStats } from "@/lib/firebase/dashboard"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />
}

export function StatusCards() {
  console.log('[StatusCards] Component mounted');
  const [stats, setStats] = useState({
    draft: 0,
    sent: 0,
    pending: 0,
    completed: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      console.log('[StatusCards] Starting to fetch stats...');
      try {
        setError(null);
        const dashboardStats = await getDashboardStats();
        console.log('[StatusCards] Received dashboard stats:', dashboardStats);
        
        if (!dashboardStats) {
          console.error('[StatusCards] No stats received');
          throw new Error('Failed to fetch dashboard statistics');
        }

        console.log('[StatusCards] Setting stats:', {
          draft: dashboardStats.draft,
          sent: dashboardStats.sent,
          pending: dashboardStats.pending,
          completed: dashboardStats.completed
        });

        setStats({
          draft: dashboardStats.draft,
          sent: dashboardStats.sent,
          pending: dashboardStats.pending,
          completed: dashboardStats.completed
        });
      } catch (error) {
        console.error('[StatusCards] Error details:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        console.log('[StatusCards] Fetch completed, setting loading to false');
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  console.log('[StatusCards] Current state:', {
    isLoading,
    error,
    stats
  });

  if (error) {
    console.log('[StatusCards] Rendering error state');
    return (
      <div className="col-span-full bg-red-500/10 text-red-500 rounded-lg border border-red-500/20 p-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0f1219] rounded-lg border border-gray-800">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            {isLoading ? (
              <LoadingSpinner className="h-6 w-6 text-gray-400" />
            ) : (
              <>
                <p className="text-2xl font-bold text-white">{stats.draft}</p>
                <p className="text-sm text-gray-400">Purchase orders in draft</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-gray-800">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Send className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            {isLoading ? (
              <LoadingSpinner className="h-6 w-6 text-gray-400" />
            ) : (
              <>
                <p className="text-2xl font-bold text-white">{stats.sent}</p>
                <p className="text-sm text-gray-400">Purchase orders sent to suppliers</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-gray-800">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            {isLoading ? (
              <LoadingSpinner className="h-6 w-6 text-gray-400" />
            ) : (
              <>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-sm text-gray-400">Awaiting delivery or partial</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0f1219] rounded-lg border border-gray-800">
        <div className="p-4 flex items-center gap-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            {isLoading ? (
              <LoadingSpinner className="h-6 w-6 text-gray-400" />
            ) : (
              <>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
                <p className="text-sm text-gray-400">Fulfilled purchase orders</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
