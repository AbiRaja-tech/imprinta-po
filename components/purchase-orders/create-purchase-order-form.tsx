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
  taxPercent: 0,
  totalPrice: 0,
}

export function CreatePurchaseOrderForm() {
  const [lineItems, setLineItems] = useState([initialLineItem])
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      poNumber: `PRINT-PO-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      supplier: "",
      projectRef: "",
      notes: "",
      attachments: "", // Add this field to track attachments in the form
    },
  })

  // Calculate total price for a line item
  const calculateTotal = (quantity: number, unitPrice: number, taxPercent: number) => {
    const subtotal = quantity * unitPrice
    const tax = subtotal * (taxPercent / 100)
    return subtotal + tax
  }

  // Update line item
  const updateLineItem = (id: string, field: string, value: any) => {
    setLineItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity, unitPrice, or taxPercent changes
          if (field === "quantity" || field === "unitPrice" || field === "taxPercent") {
            updatedItem.totalPrice = calculateTotal(
              field === "quantity" ? value : item.quantity,
              field === "unitPrice" ? value : item.unitPrice,
              field === "taxPercent" ? value : item.taxPercent,
            )
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  // Add new line item
  const addLineItem = () => {
    setLineItems((prevItems) => [...prevItems, { ...initialLineItem, id: Date.now().toString() }])
  }

  // Remove line item
  const removeLineItem = (id: string) => {
    setLineItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Calculate order total
  const orderTotal = lineItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0)

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])

      // Update the form value for attachments field
      form.setValue("attachments", "files-uploaded")
    }
  }

  // Remove file
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))

    // If no files left, clear the form value
    if (files.length <= 1) {
      form.setValue("attachments", "")
    }
  }

  // Form submission
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Combine form data with line items and files
      const purchaseOrder = {
        ...data,
        lineItems,
        files: files.map((file) => file.name),
        status: "Draft",
        totalAmount: orderTotal,
      }

      console.log("Purchase Order Created:", purchaseOrder)

      // In a real app, make API call to create PO
      // await createPurchaseOrder(purchaseOrder)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Purchase order created",
        description: "Your purchase order has been saved as a draft.",
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
      // Combine form data with line items and files
      const purchaseOrder = {
        ...data,
        lineItems,
        files: files.map((file) => file.name),
        status: "Sent",
        totalAmount: orderTotal,
      }

      console.log("Purchase Order Created and Sent:", purchaseOrder)

      // In a real app, make API call to create and send PO
      // await createAndSendPurchaseOrder(purchaseOrder)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Purchase order created and sent",
        description: "Your purchase order has been created and sent to the supplier.",
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Order Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-[#0a0d14] border-border/40",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Date the purchase order is created</FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Delivery Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-[#0a0d14] border-border/40",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
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
            <div className="rounded-md border border-border/40 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/5">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Item Type</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Description</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Quantity</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Unit Price</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Tax %</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Total</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-border/40">
                      <td className="p-3">
                        <Select value={item.type} onValueChange={(value) => updateLineItem(item.id, "type", value)}>
                          <SelectTrigger className="w-[140px] bg-[#0a0d14] border-border/40">
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
                      </td>
                      <td className="p-3">
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          className="bg-[#0a0d14] border-border/40"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity || ""}
                          onChange={(e) => updateLineItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                          className="w-[80px] bg-[#0a0d14] border-border/40"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice || ""}
                          onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          className="w-[100px] bg-[#0a0d14] border-border/40"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxPercent || ""}
                          onChange={(e) =>
                            updateLineItem(item.id, "taxPercent", Number.parseFloat(e.target.value) || 0)
                          }
                          className="w-[80px] bg-[#0a0d14] border-border/40"
                        />
                      </td>
                      <td className="p-3 font-medium">${item.totalPrice ? item.totalPrice.toFixed(2) : "0.00"}</td>
                      <td className="p-3">
                        {lineItems.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between">
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="border-border/40">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-xl font-bold">${orderTotal.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader>
            <CardTitle>Attachments & Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {/* Properly wrap the file upload in a FormField */}
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          handleFileUpload(e)
                          field.onChange(e)
                        }}
                      />
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="border-border/40"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Files
                        </Button>
                      </FormControl>
                      <FormDescription>Upload design proofs, specifications, or quotes</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {files.length > 0 && (
                <div className="rounded-md border border-border/40 p-4 bg-[#0a0d14]">
                  <div className="text-sm font-medium mb-2">Uploaded Files</div>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate max-w-[300px]">{file.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(index)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator className="bg-border/40" />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any special instructions, delivery terms, or other notes..."
                        className="min-h-[100px] bg-[#0a0d14] border-border/40"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Additional information for the supplier</FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="submit" className="border-border/40" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onSubmitAndGenerate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit & Generate PO"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
