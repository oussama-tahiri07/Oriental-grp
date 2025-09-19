import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const orderId = Number.parseInt(params.id)

    // Validate status
    const validStatuses = ["pending", "processing", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update order status in database
    await query("UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2", [status, orderId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
