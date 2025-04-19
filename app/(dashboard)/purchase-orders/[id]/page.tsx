"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Pencil, Clock, CheckCircle, Send, FileText } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { PurchaseOrderStatusSelect } from "@/components/purchase-orders/purchase-order-status-select"
import { getPurchaseOrder } from "@/lib/firebase/purchase-orders"
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PurchaseOrderPDF } from "@/components/purchase-orders/purchase-order-pdf"
import { PDFDownloadLink } from '@react-pdf/renderer';

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
  switch (status?.toLowerCase()) {
    case "draft":
      return (
        <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800">
          Draft
        </Badge>
      )
    case "sent":
      return (
        <Badge variant="outline" className="bg-indigo-950/30 text-indigo-400 border-indigo-800">
          Sent
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-950/30 text-amber-400 border-amber-800">
          Pending
        </Badge>
      )
    case "received":
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
  const [po, setPo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supplierName, setSupplierName] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    async function fetchPurchaseOrder() {
      try {
        if (!params.id) return;
        
        // Fetch the purchase order
        const purchaseOrder = await getPurchaseOrder(params.id as string);
        
        // Fetch supplier details
        if (purchaseOrder.supplier) {
          const supplierDoc = await getDoc(doc(db, 'suppliers', purchaseOrder.supplier));
          if (supplierDoc.exists()) {
            setSupplierName(supplierDoc.data()?.name || '');
          }
        }

        setPo(purchaseOrder);
      } catch (error) {
        console.error('Error fetching purchase order:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchase order details.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchaseOrder();
  }, [params.id, toast]);

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)

    try {
      // Update the status in Firestore
      const docRef = doc(db, 'purchaseOrders', params.id as string);
      await updateDoc(docRef, { status: newStatus });

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

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <p>Loading purchase order details...</p>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="flex-1 p-6">
        <p>Purchase order not found.</p>
      </div>
    );
  }

  // Prepare data for PDF
  const pdfData = {
    poNumber: po.poNumber,
    projectRef: po.projectRef,
    orderDate: new Date(po.orderDate),
    deliveryDate: new Date(po.deliveryDate),
    supplier: supplierName,
    lineItems: po.lineItems || [],
    subtotal: po.lineItems?.reduce((acc: number, item: any) => acc + (item.totalPrice || 0), 0) || 0,
    taxAmount: po.lineItems?.reduce((acc: number, item: any) => {
      const itemTax = (item.totalPrice || 0) * (item.taxPercent || 0) / 100;
      return acc + itemTax;
    }, 0) || 0,
    totalAmount: po.totalAmount || 0
  };

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
          {isClient && (
            <PDFDownloadLink
              document={<PurchaseOrderPDF data={pdfData} />}
              fileName={`${po.poNumber}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="border-border/40" disabled={loading}>
                  <Download className="mr-2 h-4 w-4" />
                  {loading ? 'Preparing PDF...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={`/purchase-orders/edit/${params.id}`}>
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
                  <p className="font-medium">{supplierName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">
                    {po.orderDate instanceof Date 
                      ? po.orderDate.toLocaleDateString('en-IN')
                      : new Date(po.orderDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">
                    {po.deliveryDate instanceof Date
                      ? po.deliveryDate.toLocaleDateString('en-IN')
                      : new Date(po.deliveryDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{po.createdBy || 'System'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left py-3 px-4">Item Type</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Unit Price</th>
                      <th className="text-right py-3 px-4">Tax %</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {po.lineItems?.map((item: any, index: number) => (
                      <tr key={index} className="border-b border-border/40">
                        <td className="py-3 px-4">{item.type}</td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right">{item.taxPercent}%</td>
                        <td className="py-3 px-4 text-right">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR'
                          }).format(item.totalPrice)}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td colSpan={5} className="py-3 px-4 text-right">
                        Grand Total:
                      </td>
                      <td className="py-3 px-4 text-right">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(po.totalAmount || 0)}
                      </td>
                    </tr>
                  </tbody>
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
              <p className="text-sm text-muted-foreground">{po.notes || 'No notes added.'}</p>
            </CardContent>
          </Card>

          {po.files && po.files.length > 0 && (
            <Card className="bg-[#0f1219] border-border/40">
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {po.files.map((file: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={file.url}
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {file.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {po.status === 'Sent' && (
                  <div className="flex items-start gap-3">
                    <Send className="h-5 w-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Sent to supplier</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(po.updatedAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">PO created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(po.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
