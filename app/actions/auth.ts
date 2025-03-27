"use server"

import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import { hash } from "bcryptjs"
import { revalidatePath } from "next/cache"
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email"
import crypto from "crypto"
import jwt from "jsonwebtoken"

interface RegisterState {
  error: string
  success: boolean
}

export async function register(state: RegisterState, formData: FormData): Promise<RegisterState> {
  try {
    await connectToDatabase()

    const name = formData.get("name") as string
    const email = (formData.get("email") as string).toLowerCase()
    const password = formData.get("password") as string

    console.log("Form data received:", { name, email, password: "***" })

    if (!name || !email || !password) {
      return { error: "All fields are required", success: false }
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long", success: false }
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return { error: "User with this email already exists", success: false }
    }

    const hashedPassword = await hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      profilePicture: "",
      watchlist: [],
    })
    const verificationToken = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET as string, { expiresIn: "1d" })

    await newUser.save()

    // Try to send welcome email with verification link
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`
      await sendWelcomeEmail(email, name, verificationUrl)
      console.log("Verification email sent to:", email)
    } catch (emailError) {
      console.error("Welcome email error:", emailError)
    }

    revalidatePath("/")
    return { error: "", success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user. Please try again.", success: false }
  }
}

export async function verifyEmail(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    await connectToDatabase()

    const user = await User.findById(decoded.userId)

    if (!user) {
      return { error: "Invalid or expired verification token", success: false }
    }

    user.isVerified = true

    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Email verification error:", error)
    return { error: "Failed to verify email. Please try again.", success: false }
  }
}
export async function requestPasswordReset(email: string) {
  try {
    await connectToDatabase()

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return { success: true }
    }

    // Generate reset token that expires in 1 hour
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.name, resetToken)

    return { success: true }
  } catch (error) {
    console.error("Password reset request error:", error)
    return { error: "Failed to process password reset request", success: false }
  }
}

export async function verifyResetToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    await connectToDatabase()

    const user = await User.findById(decoded.userId)

    if (!user) {
      return { error: "Invalid or expired reset token", success: false }
    }

    return { success: true, userId: user._id.toString() }
  } catch (error) {
    console.error("Reset token verification error:", error)
    return { error: "Invalid or expired reset token", success: false }
  }
}

export async function resetPassword(token: string, password: string, confirmPassword: string) {
  try {
    if (password !== confirmPassword) {
      return { error: "Passwords do not match", success: false }
    }

    if (password.length < 8) {
      return { error: "Password must be at least 8 characters long", success: false }
    }

    const tokenVerification = await verifyResetToken(token)

    if (!tokenVerification.success) {
      return tokenVerification
    }

    await connectToDatabase()

    const user = await User.findById(tokenVerification.userId)

    if (!user) {
      return { error: "User not found", success: false }
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update the user's password
    user.password = hashedPassword
    user.updatedAt = new Date()

    await user.save()

    return { success: true }
  } catch (error) {
    console.error("Password reset error:", error)
    return { error: "Failed to reset password", success: false }
  }
}


