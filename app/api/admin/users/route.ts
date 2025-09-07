import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const users = await query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC")

    return NextResponse.json(users.rows)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
