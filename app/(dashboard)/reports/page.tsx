"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { MonthlyPOChart } from "@/components/reports/monthly-po-chart"
import { SupplierSpendChart } from "@/components/reports/supplier-spend-chart"
import { ItemTypeChart } from "@/components/reports/item-type-chart"
import { ReportTable } from "@/components/reports/report-table"

export default function ReportsPage() {
  const [period, setPeriod] = useState("current-month")

  return (
    <div className="flex-1 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze your purchase order data and spending.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-[#0f1219] border-border/40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="border-border/40">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">↑ 12%</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,350.75</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">↑ 8%</span> from previous period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0f1219] border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average PO Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$579.78</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">↓ 3%</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-6">
        <TabsList className="bg-[#0f1219] border-border/40">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-[#0f1219] border-border/40">
              <CardHeader>
                <CardTitle>Monthly PO Count</CardTitle>
                <CardDescription>Number of purchase orders per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <MonthlyPOChart />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f1219] border-border/40">
              <CardHeader>
                <CardTitle>Supplier Spend</CardTitle>
                <CardDescription>Total spend by supplier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <SupplierSpendChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader>
              <CardTitle>Item Type Distribution</CardTitle>
              <CardDescription>Breakdown of purchase orders by item type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ItemTypeChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card className="bg-[#0f1219] border-border/40">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Purchase Order Data</CardTitle>
                <CardDescription>Detailed breakdown of all purchase orders</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border/40">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm" className="border-border/40">
                  <FilePdf className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ReportTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
