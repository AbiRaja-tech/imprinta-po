"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import UsersClient from "./users-client";

export default function UsersPage() {
  const { user, loading, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Users page effect:', {
      loading,
      userId: user?.uid,
      permissions,
      path: window?.location?.pathname
    });

    if (!loading) {
      if (!user) {
        console.log('Users page: No user, redirecting to login');
        router.push("/login");
        return;
      }

      if (!permissions?.canManageUsers) {
        console.log('Users page: No manage users permission, redirecting to dashboard');
        router.push("/dashboard");
        return;
      }
    }
  }, [loading, user, permissions, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || !permissions?.canManageUsers) {
    return null;
  }

  return <UsersClient />;
} 