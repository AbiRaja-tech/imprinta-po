"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: string, message: string) => void
  defaultEmail?: string
  poNumber: string
  isLoading?: boolean
}

export function EmailModal({
  isOpen,
  onClose,
  onSend,
  defaultEmail = "",
  poNumber,
  isLoading = false,
}: EmailModalProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [message, setMessage] = useState(
    `Dear Supplier,\n\nPlease find attached Purchase Order ${poNumber} for your review and processing.\n\nKind regards,\nImprinta Procurement Team`,
  )

  const handleSend = () => {
    onSend(email, message)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f1219] border-border/40">
        <DialogHeader>
          <DialogTitle>Send Purchase Order</DialogTitle>
          <DialogDescription>Send this purchase order via email to the supplier.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@example.com"
              className="bg-[#0a0d14] border-border/40"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] bg-[#0a0d14] border-border/40"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-border/40">
            Cancel
          </Button>
          <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700" disabled={!email || isLoading}>
            {isLoading ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
