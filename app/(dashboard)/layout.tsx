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
  const { user, loading, permissions } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    console.log('Dashboard layout effect:', {
      loading,
      userId: user?.uid,
      path: pathname,
      permissions
    });

    if (!loading) {
      if (!user) {
        console.log('No user in dashboard, redirecting to login');
        router.push("/login");
        return;
      }

      // Check permissions for protected routes
      if (pathname === '/reports' && !permissions?.canViewReports) {
        console.log('No reports permission, redirecting to dashboard');
        router.push("/dashboard");
        return;
      }
      if (pathname === '/settings' && !permissions?.canManageSettings) {
        console.log('No settings permission, redirecting to dashboard');
        router.push("/dashboard");
        return;
      }
    }
  }, [user, loading, permissions, router, pathname]);

  if (loading) {
    console.log('Dashboard showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard rendering null for no user');
    return null;
  }

  console.log('Dashboard rendering content');
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isCollapsed ? "md:ml-[60px]" : "md:ml-[220px]"
        )}>
          <MobileHeader />
          <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6 overflow-x-auto">
            <div>
              {children}
            </div>
          </main>
          
          {/* Mobile Bottom Navigation */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <nav className="flex items-center justify-around p-3">
              <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Home className="h-5 w-5" />
                <span className="text-xs">Dashboard</span>
              </Link>
              <Link href="/purchase-orders" className={`flex flex-col items-center gap-1 ${pathname === '/purchase-orders' ? 'text-primary' : 'text-muted-foreground'}`}>
                <FileText className="h-5 w-5" />
                <span className="text-xs">Orders</span>
              </Link>
              <Link href="/suppliers" className={`flex flex-col items-center gap-1 ${pathname === '/suppliers' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Building2 className="h-5 w-5" />
                <span className="text-xs">Suppliers</span>
              </Link>
              <Link href="/inventory" className={`flex flex-col items-center gap-1 ${pathname === '/inventory' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Box className="h-5 w-5" />
                <span className="text-xs">Inventory</span>
              </Link>
              <Link href="/settings" className={`flex flex-col items-center gap-1 ${pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'}`}>
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
