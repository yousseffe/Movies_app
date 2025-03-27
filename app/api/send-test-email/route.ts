import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
    // Only allow admins to send test emails
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 },
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Send test email
    const info = await transporter.sendMail({
      from: {
        name: "Sanapel Movies",
        address: process.env.EMAIL_FROM || "noreply@sanapel.com",
      },
      to: email,
      subject: "Test Email from Sanapel Movies",
      text: "This is a test email from your Sanapel Movies application.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Test Email</h2>
          <p style="color: #666; line-height: 1.5;">This is a test email from your Sanapel Movies application.</p>
          <p style="color: #666; line-height: 1.5;">If you received this email, your email configuration is working correctly!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Visit Sanapel Movies</a>
          </div>
          <p style="color: #666; line-height: 1.5;">Time sent: ${new Date().toLocaleString()}</p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

