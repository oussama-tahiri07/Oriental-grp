import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, phone, subject, message],
    )

    return NextResponse.json({ message: "Contact form submitted successfully", id: result.rows[0].id }, { status: 201 })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await query("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching contact submissions:", error)
    return NextResponse.json({ error: "Failed to fetch contact submissions" }, { status: 500 })
  }
}
