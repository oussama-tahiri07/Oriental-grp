import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const result = await query("SELECT * FROM services ORDER BY display_order ASC, created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, icon_name, display_order } = body

    const result = await query(
      `INSERT INTO services (title, description, icon_name, display_order) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, icon_name, display_order],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 })
  }
}
