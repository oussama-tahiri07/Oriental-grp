import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, logo_path, website_url, display_order } = body
    const partnerId = Number.parseInt(params.id)

    if (isNaN(partnerId)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 })
    }

    const result = await query(
      `UPDATE partners 
       SET name = $1, logo_path = $2, website_url = $3, display_order = $4
       WHERE id = $5 RETURNING *`,
      [name, logo_path, website_url, display_order || 0, partnerId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating partner:", error)
    return NextResponse.json({ error: "Failed to update partner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const partnerId = Number.parseInt(params.id)

    if (isNaN(partnerId)) {
      return NextResponse.json({ error: "Invalid partner ID" }, { status: 400 })
    }

    const result = await query("DELETE FROM partners WHERE id = $1 RETURNING *", [partnerId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Partner deleted successfully" })
  } catch (error) {
    console.error("Error deleting partner:", error)
    return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 })
  }
}
