"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { getCurrentTaxRate } from "@/lib/config/settings"
import { pdf } from '@react-pdf/renderer'
import { PurchaseOrderPDF } from './purchase-order-pdf'

// Mock data for suppliers
const suppliers = [
  { id: "1", name: "XYZ Paper Suppliers" },
  { id: "2", name: "Ink Masters Co." },
  { id: "3", name: "Premium Packaging Ltd." },
  { id: "4", name: "Machine Parts Inc." },
  { id: "5", name: "Global Print Services" },
]

// Item types for printing company
const itemTypes = [
  { id: "paper", name: "Paper" },
  { id: "ink", name: "Ink" },
  { id: "packaging", name: "Packaging" },
  { id: "machinery", name: "Machinery" },
  { id: "outsourced", name: "Outsourced Print" },
]

// Initial line item
const initialLineItem = {
  id: Date.now().toString(),
  type: "",
  description: "",
  quantity: 0,
  unitPrice: 0,
  taxPercent: getCurrentTaxRate(),
  totalPrice: 0,
}

export function CreatePurchaseOrderForm() {
  const [lineItems, setLineItems] = useState([initialLineItem])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const currentTaxRate = getCurrentTaxRate()

  const form = useForm({
    defaultValues: {
      poNumber: generatePONumber(),
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      supplier: "",
      projectRef: "",
    },
  })

  // Generate PO Number in format IMPR-{date ddmmyy}-time{hhmmss}
  function generatePONumber() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).replace(/\//g, '');
    const time = now.toLocaleTimeString('en-GB', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/:/g, '');
    return `IMPR-${date}-${time}`;
  }

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice || 0)
    }, 0)

    const taxAmount = lineItems.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      return sum + (itemSubtotal * (item.taxPercent / 100) || 0)
    }, 0)

    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount
    }
  }

  // Update line item
  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            const subtotal = value * (field === "quantity" ? item.unitPrice : item.quantity)
            const tax = subtotal * (currentTaxRate / 100)
            updatedItem.totalPrice = subtotal + tax
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  // Add new line item
  const addLineItem = () => {
    setLineItems((prevItems) => [
      ...prevItems,
      {
        ...initialLineItem,
        id: Date.now().toString(),
        taxPercent: currentTaxRate // Ensure new items use current tax rate
      }
    ])
  }

  // Remove line item
  const removeLineItem = (id: string) => {
    setLineItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Calculate order total
  const orderTotal = lineItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)

  const generateAndDownloadPDF = async (purchaseOrder: any) => {
    try {
      const blob = await pdf(<PurchaseOrderPDF data={purchaseOrder} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = `purchase-order-${purchaseOrder.poNumber}.pdf`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast({
        variant: "destructive",
        title: "Error generating PDF",
        description: "There was an error generating the PDF. Please try again.",
      })
    }
  }

  // Form submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const totals = calculateTotals()
      const purchaseOrder = {
        ...data,
        lineItems,
        status: "Draft",
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.total,
      }

      console.log("Purchase Order Created:", purchaseOrder)

      // Generate and download PDF
      await generateAndDownloadPDF(purchaseOrder)

      // In a real app, make API call to create PO
      // await createPurchaseOrder(purchaseOrder)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Purchase order created",
        description: "Your purchase order has been saved as a draft and downloaded as PDF.",
      })

      router.push("/purchase-orders")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating purchase order",
        description: "There was an error creating your purchase order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmitAndGenerate = async () => {
    const data = form.getValues()
    setIsSubmitting(true)

    try {
      const totals = calculateTotals()
      const purchaseOrder = {
        ...data,
        lineItems,
        status: "Sent",
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.total,
      }

      console.log("Purchase Order Created and Sent:", purchaseOrder)

      // Generate and download PDF
      await generateAndDownloadPDF(purchaseOrder)

      // In a real app, make API call to create and send PO
      // await createAndSendPurchaseOrder(purchaseOrder)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Purchase order created and sent",
        description: "Your purchase order has been created, sent to the supplier, and downloaded as PDF.",
      })

      router.push("/purchase-orders")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating purchase order",
        description: "There was an error creating your purchase order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totals = calculateTotals()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="poNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PO Number</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-[#0a0d14] border-border/40" />
                    </FormControl>
                    <FormDescription>Auto-generated purchase order number</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Reference</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Magazine Print April 2025"
                        className="bg-[#0a0d14] border-border/40"
                      />
                    </FormControl>
                    <FormDescription>The project or job this purchase is for</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-[#0a0d14] border-border/40",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Date the purchase order is created</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-[#0a0d14] border-border/40",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>When you expect to receive the items</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-[#0a0d14] border-border/40">
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>The vendor supplying the items</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <div className="grid grid-cols-[1fr,2fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center">
                <div>Type</div>
                <div>Description</div>
                <div>Quantity</div>
                <div>Unit Price (₹)</div>
                <div>Tax %</div>
                <div>Total (₹)</div>
                <div></div>
              </div>

              {lineItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr,2fr,1fr,1fr,1fr,1fr,auto] gap-4 items-center"
                >
                  <Select
                    value={item.type}
                    onValueChange={(value) => updateLineItem(item.id, "type", value)}
                  >
                    <SelectTrigger className="bg-[#0a0d14] border-border/40">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Item description"
                    className="bg-[#0a0d14] border-border/40"
                  />

                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value))}
                    className="bg-[#0a0d14] border-border/40"
                  />

                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value))}
                    className="bg-[#0a0d14] border-border/40"
                  />

                  <Input
                    type="number"
                    value={currentTaxRate}
                    readOnly
                    className="bg-[#0a0d14] border-border/40 opacity-50"
                  />

                  <div className="text-right">₹{item.totalPrice.toFixed(2)}</div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addLineItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>

              {/* Totals Section */}
              <div className="flex flex-col gap-2 items-end mt-6 border-t border-border/40 pt-4">
                <div className="flex justify-between w-64">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64">
                  <span className="text-muted-foreground">Tax Amount:</span>
                  <span>₹{totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-64 border-t border-border/40 pt-2 text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-between">
          <Button type="submit" variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="button" onClick={onSubmitAndGenerate} disabled={isSubmitting}>
            Submit & Generate PO
          </Button>
        </CardFooter>
      </form>
    </Form>
  )
}
