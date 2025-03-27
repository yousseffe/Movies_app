import { NextResponse } from "next/server"
import { testEmailConfiguration } from "@/lib/email"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET() {
  try {
    // Only allow admins to test email configuration
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await testEmailConfiguration()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error testing email configuration:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

