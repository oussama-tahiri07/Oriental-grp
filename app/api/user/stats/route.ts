import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Get order count for the user
    const orderCountResult = await query(`SELECT COUNT(*) as count FROM orders WHERE user_email = $1`, [email])

    // Get recent orders with item counts
    const recentOrdersResult = await query(
      `SELECT 
        o.id,
        o.status,
        o.created_at,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_email = $1
      GROUP BY o.id, o.status, o.created_at
      ORDER BY o.created_at DESC
      LIMIT 5`,
      [email],
    )

    const userStats = {
      orderCount: Number.parseInt(orderCountResult.rows[0]?.count || "0"),
      recentOrders: recentOrdersResult.rows.map((row) => ({
        id: row.id,
        status: row.status,
        created_at: row.created_at,
        items_count: Number.parseInt(row.items_count || "0"),
      })),
    }

    return NextResponse.json(userStats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user statistics" }, { status: 500 })
  }
}
