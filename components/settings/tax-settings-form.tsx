"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { DEFAULT_TAX_RATE, SETTINGS, updateTaxRate } from "@/lib/config/settings"

export function TaxSettingsForm() {
  const [taxRate, setTaxRate] = useState<number>(SETTINGS.taxRate)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would make an API call to update the settings
      // For now, we'll just simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the settings
      updateTaxRate(taxRate)

      toast({
        title: "Settings updated",
        description: "Tax rate has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tax rate. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setTaxRate(DEFAULT_TAX_RATE)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
        <CardDescription>Configure the default tax rate for purchase orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
            <div className="flex gap-2">
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="max-w-[200px]"
              />
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset to Default
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This rate will be applied to all new purchase orders.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 