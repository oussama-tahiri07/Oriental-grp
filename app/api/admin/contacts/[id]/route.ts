import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (body.is_read !== undefined) {
      // Mark as read/unread
      await query("UPDATE contact_submissions SET is_read = $1 WHERE id = $2", [body.is_read, id])
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await query("DELETE FROM contact_submissions WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 })
  }
}
