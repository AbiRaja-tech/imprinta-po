"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Mail, Pencil, Clock, CheckCircle, Send, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { EmailModal } from "@/components/purchase-orders/email-modal"
import { PurchaseOrderStatusSelect } from "@/components/purchase-orders/purchase-order-status-select"

// Mock data - would be fetched from API in real implementation
const mockPO = {
  id: "PRINT-PO-2025-001",
  poNumber: "PRINT-PO-2025-001",
  supplier: "XYZ Paper Suppliers",
  supplierEmail: "orders@xyzpaper.com",
  projectRef: "Magazine Print April 2025",
  orderDate: "2025-04-10",
  deliveryDate: "2025-04-20",
  status: "Sent",
  items: [
    {
      id: "1",
      type: "Paper",
      description: "Premium Gloss 150gsm A4",
      quantity: 5000,
      unitPrice: 0.15,
      taxPercent: 10,
      totalPrice: 825.0,
    },
    {
      id: "2",
      type: "Ink",
      description: "CMYK Process Ink Set",
      quantity: 2,
      unitPrice: 120.0,
      taxPercent: 10,
      totalPrice: 264.0,
    },
    {
      id: "3",
      type: "Packaging",
      description: "Cardboard Boxes 20x30x10cm",
      quantity: 100,
      unitPrice: 1.5,
      taxPercent: 10,
      totalPrice: 165.0,
    },
  ],
  files: [
    { name: "magazine-design-proof.pdf", url: "#" },
    { name: "supplier-quote.pdf", url: "#" },
  ],
  notes:
    "Please ensure delivery before April 20th for the magazine print run. Contact production manager for any queries.",
  createdBy: "Admin User",
  createdAt: "2025-04-08T10:30:00Z",
  updatedAt: "2025-04-10T14:15:00Z",
  total: 1254.0,
}

// Helper function to get status icon
function getStatusIcon(status: string) {
  switch (status) {
    case "Draft":
      return <FileText className="h-5 w-5 text-blue-400" />
    case "Sent":
      return <Send className="h-5 w-5 text-indigo-400" />
    case "Pending":
      return <Clock className="h-5 w-5 text-amber-400" />
    case "Received":
      return <CheckCircle className="h-5 w-5 text-emerald-400" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

// Helper function to get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case "Draft":
      return (
        <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800">
          Draft
        </Badge>
      )
    case "Sent":
      return (
        <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-800">
          Sent
        </Badge>
      )
    case "Pending":
      return (
        <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800">
          Pending
        </Badge>
      )
    case "Received":
      return (
        <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-800">
          Received
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function PurchaseOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [po, setPo] = useState(mockPO)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, fetch the PO data from API
  useEffect(() => {
    // Fetch PO data using params.id
    // For now, we're using mock data
  }, [params.id])

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)

    try {
      // In a real app, make API call to update status
      // await updatePOStatus(po.id, newStatus)

      // Update local state
      setPo({ ...po, status: newStatus })

      toast({
        title: "Status updated",
        description: `Purchase order status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating the status. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmail = async (email: string, message: string) => {
    setIsLoading(true)

    try {
      // In a real app, make API call to send email
      // await sendPOEmail(po.id, email, message)

      // Update status to "Sent" if it was "Draft"
      if (po.status === "Draft") {
        setPo({ ...po, status: "Sent" })
      }

      setIsEmailModalOpen(false)

      toast({
        title: "Email sent",
        description: `Purchase order sent to ${email}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Email failed",
        description: "There was an error sending the email. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    // In a real app, make API call to generate and download PDF
    toast({
      title: "Downloading PDF",
      description: "Your purchase order PDF is being generated and downloaded.",
    })
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/purchase-orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {po.poNumber}
              <span className="ml-3">{getStatusBadge(po.status)}</span>
            </h1>
            <p className="text-muted-foreground mt-1">{po.projectRef}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <PurchaseOrderStatusSelect
            currentStatus={po.status}
            onStatusChange={handleStatusChange}
            disabled={isLoading}
          />
          <Button variant="outline" className="border-border/40" onClick={() => setIsEmailModalOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email PO
          </Button>
          <Button variant="outline" className="border-border/40" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/purchase-orders/${po.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{po.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{po.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">{po.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{po.createdBy}</p>
                </div>
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
                      <th className="text-right text-xs font-medium text-muted-foreground p-3">Quantity</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-3">Unit Price</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-3">Tax %</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {po.items.map((item) => (
                      <tr key={item.id} className="border-b border-border/40">
                        <td className="p-3 text-sm">{item.type}</td>
                        <td className="p-3 text-sm">{item.description}</td>
                        <td className="p-3 text-sm text-right">{item.quantity}</td>
                        <td className="p-3 text-sm text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-sm text-right">{item.taxPercent}%</td>
                        <td className="p-3 text-sm font-medium text-right">${item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/5">
                      <td colSpan={5} className="p-3 text-sm font-medium text-right">
                        Grand Total:
                      </td>
                      <td className="p-3 text-base font-bold text-right">${po.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{po.notes || "No notes provided."}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              {po.files && po.files.length > 0 ? (
                <ul className="space-y-2">
                  {po.files.map((file, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={file.url}
                        className="text-blue-500 hover:text-blue-400 flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No files attached.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Send className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sent to supplier</p>
                    <p className="text-xs text-muted-foreground">{new Date(po.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">PO created</p>
                    <p className="text-xs text-muted-foreground">{new Date(po.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleSendEmail}
        defaultEmail={po.supplierEmail}
        poNumber={po.poNumber}
        isLoading={isLoading}
      />
    </div>
  )
}
