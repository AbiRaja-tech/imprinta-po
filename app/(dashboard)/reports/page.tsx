"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { MonthlyPOChart } from "@/components/reports/monthly-po-chart"
import { SupplierSpendChart } from "@/components/reports/supplier-spend-chart"
import { ItemTypeChart } from "@/components/reports/item-type-chart"
import { ReportTable } from "@/components/reports/report-table"
import { getReportStats, ReportStats } from "@/lib/firebase/reports"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { pdf } from "@react-pdf/renderer"
import { ReportsPDF } from "@/components/reports/reports-pdf"
import { useToast } from "@/components/ui/use-toast"

export default function ReportsPage() {
  const [period, setPeriod] = useState("current")
  const [stats, setStats] = useState<ReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getReportStats(period as 'current' | 'previous')
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [period])

  const handleExport = async () => {
    if (!stats) return

    try {
      setExporting(true)
      const blob = await pdf(<ReportsPDF data={stats} period={period} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `imprinta-report-${period}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Report exported",
        description: "Your report has been exported as PDF successfully.",
      })
    } catch (error) {
      console.error('Error exporting report:', error)
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting the report. Please try again.",
      })
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>
        <p className="text-muted-foreground">Error loading reports data.</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze your purchase order data and spending.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Month</SelectItem>
              <SelectItem value="previous">Previous Month</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={exporting}
          >
            <FileDown className="mr-2 h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Purchase Orders</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{stats.totalPOs}</p>
            <span className={`ml-2 text-sm ${stats.changeFromPrevious.poCount >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.changeFromPrevious.poCount >= 0 ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />}
              {formatPercentage(stats.changeFromPrevious.poCount)}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{formatCurrency(stats.totalSpent)}</p>
            <span className={`ml-2 text-sm ${stats.changeFromPrevious.spent >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.changeFromPrevious.spent >= 0 ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />}
              {formatPercentage(stats.changeFromPrevious.spent)}
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Average PO Value</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">{formatCurrency(stats.averagePOValue)}</p>
            <span className={`ml-2 text-sm ${stats.changeFromPrevious.average >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.changeFromPrevious.average >= 0 ? <ArrowUpIcon className="inline h-4 w-4" /> : <ArrowDownIcon className="inline h-4 w-4" />}
              {formatPercentage(stats.changeFromPrevious.average)}
            </span>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly PO Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {stats.monthlyPOCount.map((month, index) => {
            const height = `${(month.count / Math.max(...stats.monthlyPOCount.map(m => m.count))) * 100}%`
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-primary/20 rounded-t relative" style={{ height }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">{month.count}</div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">{month.month}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Supplier Spend</h3>
          <div className="space-y-4">
            {stats.supplierSpend.sort((a, b) => b.total - a.total).map((supplier, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{supplier.supplier}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(supplier.total)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(supplier.total / Math.max(...stats.supplierSpend.map(s => s.total))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Item Type Distribution</h3>
          <div className="space-y-4">
            {stats.itemTypeDistribution.sort((a, b) => b.total - a.total).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.type}</span>
                    <span className="text-xs text-muted-foreground">{item.count} items</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500 ease-in-out"
                    style={{
                      width: `${(item.total / Math.max(...stats.itemTypeDistribution.map(i => i.total))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
