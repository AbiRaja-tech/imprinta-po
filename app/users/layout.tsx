"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, permissions, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Users layout effect:', {
      loading,
      userId: user?.uid,
      userRole,
      permissions,
      path: window?.location?.pathname
    });

    if (!loading) {
      if (!user) {
        console.log('Users layout: No user, redirecting to login');
        router.replace("/login");
        return;
      }

      if (!permissions?.canManageUsers) {
        console.log('Users layout: No manage users permission, redirecting to dashboard', {
          permissions,
          userRole
        });
        router.replace("/dashboard");
        return;
      }

      console.log('Users layout: Access granted');
    }
  }, [loading, user, permissions, userRole, router]);

  if (loading) {
    console.log('Users layout: Loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !permissions?.canManageUsers) {
    console.log('Users layout: Access denied');
    return null;
  }

  console.log('Users layout: Rendering content');
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {children}
    </div>
  );
} 