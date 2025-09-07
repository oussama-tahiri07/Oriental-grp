import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM partners ORDER BY display_order ASC, created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, logo_path, website_url, display_order } = body

    const result = await query(
      `INSERT INTO partners (name, logo_path, website_url, display_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, logo_path, website_url, display_order || 0],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating partner:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}
