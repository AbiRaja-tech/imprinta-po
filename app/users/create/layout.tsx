"use client";

import { useAuth } from "@/contexts/auth-context";

export default function CreateUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {children}
    </div>
  );
} 