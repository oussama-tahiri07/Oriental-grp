import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM blog_categories ORDER BY name ASC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching blog categories:", error)
    return NextResponse.json({ error: "Failed to fetch blog categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    const result = await query(`INSERT INTO blog_categories (name, slug) VALUES ($1, $2) RETURNING *`, [name, slug])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating blog category:", error)
    return NextResponse.json({ error: "Failed to create blog category" }, { status: 500 })
  }
}
