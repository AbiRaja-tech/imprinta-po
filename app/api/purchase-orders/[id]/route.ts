import { NextRequest, NextResponse } from "next/server"

// In a real app, this would be stored in a database
const purchaseOrders: any[] = []

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    // Find purchase order by ID
    const purchaseOrder = purchaseOrders.find((po) => po.id === id || po.poNumber === id)

    if (!purchaseOrder) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    return NextResponse.json(purchaseOrder)
  } catch (error) {
    console.error("Error fetching purchase order:", error)
    return NextResponse.json({ error: "Failed to fetch purchase order" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    const data = await request.json()

    // Find purchase order index
    const index = purchaseOrders.findIndex((po) => po.id === id || po.poNumber === id)

    if (index === -1) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Update purchase order
    const updatedPO = {
      ...purchaseOrders[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    purchaseOrders[index] = updatedPO

    return NextResponse.json(updatedPO)
  } catch (error) {
    console.error("Error updating purchase order:", error)
    return NextResponse.json({ error: "Failed to update purchase order" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    // Find purchase order index
    const index = purchaseOrders.findIndex((po) => po.id === id || po.poNumber === id)

    if (index === -1) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 })
    }

    // Remove purchase order
    purchaseOrders.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting purchase order:", error)
    return NextResponse.json({ error: "Failed to delete purchase order" }, { status: 500 })
  }
}
