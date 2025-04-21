"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, createContext, useContext, useState } from "react";
import { Home, FileText, Building2, Package, Box, FileBarChart2, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, permissions, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'b' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    console.log('[DashboardLayout] Mount effect running', {
      loading,
      isAuthenticated,
      userId: user?.uid,
      pathname
    });

    // Handle authentication state
    if (!loading && !isRedirecting) {
      if (!isAuthenticated || !user) {
        console.log('[DashboardLayout] User not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
      }

      // Check permissions for protected routes
      if (pathname === '/reports' && !permissions?.canViewReports) {
        console.log('[DashboardLayout] No reports permission, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      }
      if (pathname === '/settings' && !permissions?.canManageSettings) {
        console.log('[DashboardLayout] No settings permission, redirecting to dashboard');
        window.location.href = '/dashboard';
        return;
      }
    }
  }, [user, loading, permissions, pathname, isRedirecting, isAuthenticated]);

  // Show loading state
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0d14] text-white">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <div className="text-sm text-gray-400">Please wait while we set up your dashboard</div>
        </div>
      </div>
    );
  }

  // Don't render anything if there's no user
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen bg-[#0a0d14]">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isCollapsed ? "md:ml-[60px]" : "md:ml-[220px]"
        )}>
          <MobileHeader />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-x-auto text-white">
            <div>
              {children}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#0a0d14]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0d14]/60 z-50">
            <nav className="flex items-center justify-around p-3">
              <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-blue-500' : 'text-gray-400'}`}>
                <Home className="h-5 w-5" />
                <span className="text-xs">Dashboard</span>
              </Link>
              <Link href="/purchase-orders" className={`flex flex-col items-center gap-1 ${pathname === '/purchase-orders' ? 'text-blue-500' : 'text-gray-400'}`}>
                <FileText className="h-5 w-5" />
                <span className="text-xs">Orders</span>
              </Link>
              <Link href="/suppliers" className={`flex flex-col items-center gap-1 ${pathname === '/suppliers' ? 'text-blue-500' : 'text-gray-400'}`}>
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Suppliers</span>
              </Link>
              <Link href="/inventory" className={`flex flex-col items-center gap-1 ${pathname === '/inventory' ? 'text-blue-500' : 'text-gray-400'}`}>
                <Box className="h-5 w-5" />
                <span className="text-xs">Inventory</span>
              </Link>
              <Link href="/settings" className={`flex flex-col items-center gap-1 ${pathname === '/settings' ? 'text-blue-500' : 'text-gray-400'}`}>
                <Settings className="h-5 w-5" />
                <span className="text-xs">Settings</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
