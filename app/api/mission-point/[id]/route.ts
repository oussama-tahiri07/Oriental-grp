import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { text, icon_name, display_order } = body
    const missionId = Number.parseInt(params.id)

    if (isNaN(missionId)) {
      return NextResponse.json({ error: "Invalid mission point ID" }, { status: 400 })
    }

    const result = await query(
      `UPDATE mission_points 
       SET text = $1, icon_name = $2, display_order = $3
       WHERE id = $4 RETURNING *`,
      [text, icon_name, display_order || 0, missionId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Mission point not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating mission point:", error)
    return NextResponse.json({ error: "Failed to update mission point" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const missionId = Number.parseInt(params.id)

    if (isNaN(missionId)) {
      return NextResponse.json({ error: "Invalid mission point ID" }, { status: 400 })
    }

    const result = await query("DELETE FROM mission_points WHERE id = $1 RETURNING *", [missionId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Mission point not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Mission point deleted successfully" })
  } catch (error) {
    console.error("Error deleting mission point:", error)
    return NextResponse.json({ error: "Failed to delete mission point" }, { status: 500 })
  }
}
