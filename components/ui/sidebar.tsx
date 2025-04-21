"use client"

import * as React from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarVariants = cva(
  "group/sidebar relative flex h-full flex-col gap-4 px-2 py-2 data-[collapsible=true]:transition-[width]",
  {
    variants: {
      variant: {
        default:
          "border-r bg-sidebar text-sidebar-foreground shadow-sm data-[collapsed=true]:items-center",
        floating:
          "m-2 rounded-lg border bg-sidebar text-sidebar-foreground shadow-md data-[collapsed=true]:items-center",
      },
      size: {
        sm: "w-64 data-[collapsed=true]:w-[50px]",
        default: "w-72 data-[collapsed=true]:w-16",
        lg: "w-80 data-[collapsed=true]:w-[70px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
  collapsible?: boolean | "icon"
  collapsedSize?: number
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      className,
      children,
      collapsed = false,
      collapsible = false,
      collapsedSize,
      variant,
      size,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(collapsed)

    return (
      <div
        ref={ref}
        data-collapsed={isCollapsed}
        data-collapsible={collapsible}
        className={cn(sidebarVariants({ variant, size, className }))}
        style={{
          width: isCollapsed ? `${collapsedSize}px` : undefined,
        }}
        {...props}
      >
        {children}
        {collapsible === "icon" ? (
          <Button
            variant="ghost"
            className={cn(
              "absolute -right-3 top-2 z-40 h-6 w-6 rotate-0 rounded-full p-0 data-[collapsed=true]:rotate-180",
              "border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        ) : null}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-[60px] items-center gap-2 px-4 group-data-[collapsed=true]/sidebar:justify-center",
      className
    )}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex grow flex-col gap-2 overflow-y-auto overflow-x-hidden",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-[60px] items-center gap-2 px-4 group-data-[collapsed=true]/sidebar:justify-center",
      className
    )}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <a
      ref={ref}
      className={cn(
        "group/menu-item relative flex h-10 items-center gap-2 rounded-md px-4 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "group-data-[collapsed=true]/sidebar:justify-center group-data-[collapsed=true]/sidebar:px-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})
SidebarItem.displayName = "SidebarItem"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
}
