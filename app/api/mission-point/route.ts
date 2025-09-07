import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM mission_points ORDER BY display_order ASC, created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching mission points:", error)
    return NextResponse.json({ error: "Failed to fetch mission points" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, icon_name, display_order } = body

    const result = await query(
      `INSERT INTO mission_points (text, icon_name, display_order) 
       VALUES ($1, $2, $3) RETURNING *`,
      [text, icon_name, display_order || 0],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating mission point:", error)
    return NextResponse.json({ error: "Failed to create mission point" }, { status: 500 })
  }
}
