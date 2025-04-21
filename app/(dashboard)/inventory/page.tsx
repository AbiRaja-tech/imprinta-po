"use client"

import { Package } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] p-4 md:p-8">
      <div className="w-full max-w-lg mx-auto text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <Package 
            className="w-full h-full text-primary animate-bounce" 
            strokeWidth={1.5} 
          />
          <div className="absolute -inset-4 border-4 border-primary/20 rounded-full animate-ping" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground">
            We're building something amazing for your inventory management.
            <br />
            Stay tuned!
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium">In Development</span>
        </div>
      </div>
    </div>
  )
} 