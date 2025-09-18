import nodemailer from "nodemailer"

// SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Oriental Group" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.SMTP_USER,
    })

    console.log("Email sent: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    let errorMessage = "Unknown error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return { success: false, error: errorMessage }
  }
}

export function generateReplyTemplate(
  customerName: string,
  originalMessage: string,
  adminReply: string,
  adminName: string,
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reply from Oriental Group</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Oriental Group</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Moroccan Argan Oil Products</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #8B4513; margin-top: 0;">Dear ${customerName},</h2>
          
          <p>Thank you for contacting Oriental Group. We have received your inquiry and are pleased to respond:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D2691E;">
            <h3 style="color: #8B4513; margin-top: 0;">Our Response:</h3>
            <p style="white-space: pre-wrap;">${adminReply}</p>
          </div>
          
          <div style="background: #e8e8e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #666;">Your Original Message:</h4>
            <p style="color: #666; font-style: italic; white-space: pre-wrap;">${originalMessage}</p>
          </div>
          
          <p>If you have any additional questions, please don't hesitate to contact us.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0 0 0;">${adminName}</p>
            <p style="margin: 5px 0 0 0; color: #8B4513;">Oriental Group Team</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Oriental Group - Premium Moroccan Argan Oil Products</p>
          <p>This email was sent in response to your inquiry. Please do not reply to this automated message.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
