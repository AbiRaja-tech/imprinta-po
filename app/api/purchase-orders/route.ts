import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In a real app, this would be stored in a database
const purchaseOrders: any[] = []

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const supplier = searchParams.get("supplier")
    const status = searchParams.get("status")
    const itemType = searchParams.get("itemType")

    // Filter purchase orders
    let filteredPOs = [...purchaseOrders]

    if (supplier) {
      filteredPOs = filteredPOs.filter((po) => po.supplier === supplier)
    }

    if (status) {
      filteredPOs = filteredPOs.filter((po) => po.status === status)
    }

    if (itemType) {
      filteredPOs = filteredPOs.filter((po) => po.lineItems.some((item: any) => item.type === itemType))
    }

    return NextResponse.json(filteredPOs)
  } catch (error) {
    console.error("Error fetching purchase orders:", error)
    return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Generate PO number if not provided
    if (!data.poNumber) {
      const poCount = purchaseOrders.length + 1
      data.poNumber = `PRINT-PO-2025-${String(poCount).padStart(3, "0")}`
    }

    // Add metadata
    const newPO = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to "database"
    purchaseOrders.push(newPO)

    return NextResponse.json(newPO, { status: 201 })
  } catch (error) {
    console.error("Error creating purchase order:", error)
    return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 })
  }
}
