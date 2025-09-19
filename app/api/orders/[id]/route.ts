import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Get order details
    const orderResult = await query(`SELECT * FROM orders WHERE id = $1`, [orderId])

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Get order items with product details
    const itemsResult = await query(
      `SELECT oi.*, p.title, p.description, p.image_path 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [orderId],
    )

    return NextResponse.json({
      ...order,
      items: itemsResult.rows,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
