"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
import { createPurchaseOrder, PurchaseOrder } from '@/lib/firebase/purchase-orders'
import { SupplierSelect } from "./supplier-select"
import { TypeSelect } from "./type-select"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getSuppliers } from '@/lib/firebase/suppliers'
import { getTypes } from '@/lib/firebase/types'

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

// Form validation schema
const formSchema = z.object({
  poNumber: z.string(),
  projectRef: z.string().min(1, "Project reference is required"),
  orderDate: z.date(),
  deliveryDate: z.date(),
  supplier: z.string().min(1, "Supplier is required"),
})

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

interface LineItem {
  type: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function CreatePurchaseOrderForm() {
  const [lineItems, setLineItems] = useState([initialLineItem])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const currentTaxRate = getCurrentTaxRate()

  const form = useForm({
    resolver: zodResolver(formSchema),
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

  // Validate line items
  const validateLineItems = () => {
    const errors: string[] = [];
    lineItems.forEach((item, index) => {
      if (!item.type) errors.push(`Type is required for item ${index + 1}`);
      if (!item.description) errors.push(`Description is required for item ${index + 1}`);
      if (!item.quantity || item.quantity <= 0) errors.push(`Valid quantity is required for item ${index + 1}`);
      if (!item.unitPrice || item.unitPrice <= 0) errors.push(`Valid unit price is required for item ${index + 1}`);
    });
    return errors;
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
        taxPercent: currentTaxRate
      }
    ])
  }

  // Remove line item
  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "At least one item is required.",
      })
      return;
    }
    setLineItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const generateAndDownloadPDF = async (purchaseOrder: any) => {
    try {
      if (typeof window === 'undefined') return;

      // Fetch supplier and type data
      const suppliers = await getSuppliers();
      const types = await getTypes();

      // Get supplier name
      const supplierName = suppliers.find(s => s.id === purchaseOrder.supplier)?.name || purchaseOrder.supplier;

      // Get type names for line items
      const lineItemsWithNames = purchaseOrder.lineItems.map((item: LineItem) => ({
        ...item,
        type: types.find(t => t.id === item.type)?.name || item.type
      }));

      // Create PDF data with resolved names
      const pdfData = {
        ...purchaseOrder,
        supplier: supplierName,
        lineItems: lineItemsWithNames
      };

      const blob = await pdf(<PurchaseOrderPDF data={pdfData} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `purchase-order-${purchaseOrder.poNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
    // Validate line items
    const lineItemErrors = validateLineItems();
    if (lineItemErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: lineItemErrors[0],
      });
      return;
    }

    setIsSubmitting(true)

    try {
      const totals = calculateTotals()
      const purchaseOrder: Omit<PurchaseOrder, 'createdAt'> = {
        ...data,
        lineItems,
        status: "Draft" as const,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.total,
      }

      // Save to Firestore
      await createPurchaseOrder(purchaseOrder)

      // Generate and download PDF
      await generateAndDownloadPDF(purchaseOrder)

      toast({
        title: "Purchase order created",
        description: "Your purchase order has been saved as a draft and downloaded as PDF.",
      })

      router.push("/purchase-orders")
    } catch (error) {
      console.error('Error creating purchase order:', error)
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
    // Validate form first
    const formValid = await form.trigger();
    if (!formValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Validate line items
    const lineItemErrors = validateLineItems();
    if (lineItemErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: lineItemErrors[0],
      });
      return;
    }

    const data = form.getValues()
    setIsSubmitting(true)

    try {
      const totals = calculateTotals()
      const purchaseOrder: Omit<PurchaseOrder, 'createdAt'> = {
        ...data,
        lineItems,
        status: "Sent" as const,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        totalAmount: totals.total,
      }

      // Save to Firestore
      await createPurchaseOrder(purchaseOrder)

      // Generate and download PDF
      await generateAndDownloadPDF(purchaseOrder)

      toast({
        title: "Purchase order created and sent",
        description: "Your purchase order has been created, saved to the database, and downloaded as PDF.",
      })

      router.push("/purchase-orders")
    } catch (error) {
      console.error('Error creating purchase order:', error)
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
                    <FormLabel>Project Reference *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Magazine Print April 2025"
                        className="bg-[#0a0d14] border-border/40"
                      />
                    </FormControl>
                    <FormDescription>The project or job this purchase is for</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery Date *</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <SupplierSelect
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                    <FormDescription>The vendor supplying the items</FormDescription>
                    <FormMessage />
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
              {lineItems.map((item) => (
                <div key={item.id} className="space-y-4 bg-[#0a0d14] p-4 rounded-lg border border-border/40">
                  {/* Row 1: Type and Delete Button */}
                  <div className="flex justify-between items-center">
                    <div className="w-full max-w-[200px]">
                      <FormLabel>Type *</FormLabel>
                      <TypeSelect
                        value={item.type}
                        onValueChange={(value) => updateLineItem(item.id, "type", value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeLineItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Row 2: Description */}
                  <div className="w-full">
                    <FormLabel>Description *</FormLabel>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="bg-[#0f1219] border-border/40"
                    />
                  </div>

                  {/* Row 3: Quantity and Unit Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Quantity *</FormLabel>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value))}
                        min={0}
                        className="bg-[#0f1219] border-border/40"
                      />
                    </div>
                    <div>
                      <FormLabel>Unit Price (₹) *</FormLabel>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value))}
                        min={0}
                        className="bg-[#0f1219] border-border/40"
                      />
                    </div>
                  </div>

                  {/* Row 4: Tax and Total */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Tax %</FormLabel>
                      <Input
                        type="number"
                        value={item.taxPercent}
                        onChange={(e) => updateLineItem(item.id, "taxPercent", parseFloat(e.target.value))}
                        min={0}
                        className="bg-[#0f1219] border-border/40"
                      />
                    </div>
                    <div>
                      <FormLabel>Total (₹)</FormLabel>
                      <Input
                        type="number"
                        value={item.totalPrice.toFixed(2)}
                        readOnly
                        className="bg-[#0f1219] border-border/40"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-[#0a0d14] border-border/40"
                onClick={addLineItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount:</span>
                  <span>₹{totals.taxAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>₹{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              className="bg-[#0a0d14] border-border/40"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={onSubmitAndGenerate}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit & Generate PO
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
