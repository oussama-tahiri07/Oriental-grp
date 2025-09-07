import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM products ORDER BY display_order ASC, created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_path, color_class, is_featured, display_order } = body

    const result = await query(
      `INSERT INTO products (title, description, image_path, color_class, is_featured, display_order) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, image_path, color_class, is_featured, display_order],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
