import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const contacts = await query("SELECT * FROM contact_submissions ORDER BY created_at DESC")

    return NextResponse.json(contacts.rows)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
