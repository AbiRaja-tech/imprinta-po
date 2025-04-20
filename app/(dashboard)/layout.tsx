"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, permissions } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
      if (pathname === '/users' && !permissions?.canManageUsers) {
        console.log('No users permission, redirecting to dashboard');
        router.push("/dashboard");
        return;
      }
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
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <MobileHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
