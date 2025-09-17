import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_name, user_email, user_phone, shipping_address, items, notes }: { user_name: string; user_email: string; user_phone?: string; shipping_address: string; items: { product_id: number; quantity: number }[]; notes?: string } = body

    // Validate required fields
    if (!user_name || !user_email || !shipping_address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Start transaction
    const client = await query("BEGIN")

    try {
      // Create order
      const orderResult = await query(
        `
        INSERT INTO orders (user_name, user_email, user_phone, shipping_address, status)
        VALUES ($1, $2, $3, $4, 'pending')
        RETURNING id
      `,
        [user_name, user_email, user_phone, shipping_address],
      )

      const orderId = orderResult.rows[0].id

      // Create order items
      for (const item of items) {
        await query(
          `
          INSERT INTO order_items (order_id, product_id, quantity)
          VALUES ($1, $2, $3)
        `,
          [orderId, item.product_id, item.quantity],
        )
      }

      // Add order notes to contact submissions for admin review
      await query(
        `
        INSERT INTO contact_submissions (name, email, phone, subject, message, status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
      `,
        [
          user_name,
          user_email,
          user_phone || "",
          `Quote Request #${orderId}`,
          `Quote Request Details:
        - Request ID: ${orderId}
        - Total Items: ${items.length}
        - Products: ${items.map((item) => `${item.quantity}x Product ID ${item.product_id}`).join(", ")}
        - Shipping Address: ${shipping_address}
        ${notes ? `- Special Requirements: ${notes}` : ""}
        
        Please review this quote request and send personalized pricing to the customer.`,
        ],
      )

      await query("COMMIT")

      return NextResponse.json({
        success: true,
        orderId,
        message:
          "Quote request submitted successfully. You will receive a personalized quote via email within 24 hours.",
      })
    } catch (error) {
      await query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Error creating quote request:", error)
    return NextResponse.json({ error: "Failed to create quote request" }, { status: 500 })
  }
}
