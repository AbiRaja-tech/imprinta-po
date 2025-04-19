import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// In a real app, this would be stored in a database
const suppliers = [
  {
    id: "1",
    name: "XYZ Paper Suppliers",
    contactName: "John Smith",
    email: "john@xyzpaper.com",
    phone: "+1 (555) 123-4567",
    address: "123 Paper Mill Rd, Papertown, PT 12345",
    category: "Paper",
    status: "Active",
  },
  {
    id: "2",
    name: "Ink Masters Co.",
    contactName: "Sarah Johnson",
    email: "sarah@inkmasters.com",
    phone: "+1 (555) 234-5678",
    address: "456 Ink Blvd, Colorville, CV 23456",
    category: "Ink",
    status: "Active",
  },
  {
    id: "3",
    name: "Premium Packaging Ltd.",
    contactName: "Michael Brown",
    email: "michael@premiumpackaging.com",
    phone: "+1 (555) 345-6789",
    address: "789 Box Street, Wraptown, WT 34567",
    category: "Packaging",
    status: "Active",
  },
]

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    // Filter suppliers
    let filteredSuppliers = [...suppliers]

    if (category) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.category === category)
    }

    if (status) {
      filteredSuppliers = filteredSuppliers.filter((supplier) => supplier.status === status)
    }

    return NextResponse.json(filteredSuppliers)
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Add metadata
    const newSupplier = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to "database"
    suppliers.push(newSupplier)

    return NextResponse.json(newSupplier, { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}
