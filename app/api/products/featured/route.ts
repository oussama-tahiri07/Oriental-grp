import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        id,
        title,
        description,
        image_path,
        color_class,
        is_featured,
        display_order
      FROM products 
      WHERE is_featured = true
      ORDER BY display_order ASC, created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch featured products" }, { status: 500 })
  }
}
