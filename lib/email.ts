"use server"

import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import WelcomeEmail from "@/emails/welcome-email"
import PasswordResetEmail from "@/emails/password-reset-email"
import NotificationEmail from "@/emails/notification-email"
import React from "react"

// Singleton Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  pool: true, // ✅ Enable connection pooling
  maxConnections: 5, // ✅ Maximum concurrent connections
  maxMessages: 100, // ✅ Maximum messages per connection
  rateLimit: 10,
})

// Debugging: Log SMTP configuration
console.log("📧 SMTP Configuration:", {
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: process.env.EMAIL_SERVER_SECURE,
  user: process.env.EMAIL_SERVER_USER ? "**** (Hidden)" : "❌ MISSING USER",
  pass: process.env.EMAIL_SERVER_PASSWORD ? "**** (Hidden)" : "❌ MISSING PASSWORD",
})

interface EmailProps {
  name: string
  resetUrl?: string
  notificationTitle?: string
  notificationBody?: string
  verificationUrl?: string
}

/**
 * Generic function to send emails
 */
async function sendEmail(
  to: string,
  subject: string,
  EmailComponent: React.FC<EmailProps>,
  props: EmailProps
) {
  try {
    console.log(`📨 Preparing to send email: ${subject} to ${to}`)

    // Render the component into static HTML
    const emailHtml = await render(React.createElement(EmailComponent, props))

    const mailOptions = {
      from: `"Movie Platform" <${process.env.EMAIL_FROM || "noreply@movieplatform.com"}>`,
      to,
      subject,
      html: emailHtml,
    }

    console.log("📧 Email options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const response = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", response.messageId)

    return { success: true, messageId: response.messageId }
  } catch (error) {
    console.error(`❌ Error sending email (${subject}) to ${to}:`, error)
    return { error: `Failed to send email: ${subject}`, details: error }
  }
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail(to: string, name: string, verificationUrl?: string) {
  return sendEmail(to, "Welcome to Movie Platform!", WelcomeEmail, { name, verificationUrl })
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(to: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
  return sendEmail(to, "Reset Your Password", PasswordResetEmail, { name, resetUrl })
}

/**
 * Send Notification Email
 */
export async function sendNotificationEmail(
  to: string,
  name: string,
  notificationTitle: string,
  notificationBody: string
) {
  return sendEmail(to, notificationTitle, NotificationEmail, { name, notificationTitle, notificationBody })
}

/**
 * Test Email Configuration
 */
export async function testEmailConfiguration() {
  console.log("🔍 Testing email transporter configuration...")

  try {
    // Verify the connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("❌ Email configuration verification failed:", error)
          reject(error)
        } else {
          console.log("✅ Email configuration verified successfully")
          resolve(success)
        }
      })
    })

    return { success: true, message: "Email configuration is valid" }
  } catch (error) {
    console.error("❌ Error testing email configuration:", error)
    return { success: false, message: (error as any).message || "Failed to test email configuration" }
  }
}
