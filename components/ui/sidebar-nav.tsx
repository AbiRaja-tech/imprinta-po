"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { User } from "@/lib/firebase/users";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  user?: User | null;
}

export function SidebarNav({ className, user, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      <Link
        href="/dashboard"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          pathname === "/dashboard"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
          "justify-start"
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/purchase-orders"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          pathname === "/purchase-orders"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
          "justify-start"
        )}
      >
        Purchase Orders
      </Link>
      <Link
        href="/suppliers"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          pathname === "/suppliers"
            ? "bg-muted hover:bg-muted"
            : "hover:bg-transparent hover:underline",
          "justify-start"
        )}
      >
        Suppliers
      </Link>
      {user?.role === "admin" && (
        <Link
          href="/users"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === "/users"
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          Users
        </Link>
      )}
    </nav>
  );
} 