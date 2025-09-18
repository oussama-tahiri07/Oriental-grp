import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendEmail, generateReplyTemplate } from "@/lib/email"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { reply, adminName } = await request.json()

    if (!reply || !adminName) {
      return NextResponse.json({ error: "Reply and admin name are required" }, { status: 400 })
    }

    // Get the contact submission details
    const contactResult = await query("SELECT * FROM contact_submissions WHERE id = $1", [id])

    if (contactResult.rows.length === 0) {
      return NextResponse.json({ error: "Contact submission not found" }, { status: 404 })
    }

    const contact = contactResult.rows[0]

    // Generate email template
    const emailHtml = generateReplyTemplate(contact.name, contact.message, reply, adminName)

    // Send email
    const emailResult = await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject || "Your inquiry to Oriental Group"}`,
      html: emailHtml,
    })

    if (!emailResult.success) {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Update the database with reply information
    await query(
      `UPDATE contact_submissions 
       SET admin_reply = $1, replied_at = NOW(), is_read = true 
       WHERE id = $2`,
      [reply, id],
    )

    return NextResponse.json({
      success: true,
      message: "Reply sent successfully",
      messageId: emailResult.messageId,
    })
  } catch (error) {
    console.error("Error sending reply:", error)
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 })
  }
}
