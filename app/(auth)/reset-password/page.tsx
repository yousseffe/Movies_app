"use client"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Suspense } from "react"

export default function ResetPasswordPage() {
  const {t, language} = useLanguage() 
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 md:p-8">
        <Link href="/" className="mb-4 flex items-center text-2xl font-bold text-primary">
          <span className="sr-only">{language === "en" ? "S" : "س"}</span>
          <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
            <span className="text-xl font-bold">V</span>
          </div>
          {language === "en" ? "Sanapel" : "سنابل"}
        </Link>
        <div className="mx-auto flex w-full max-w-md justify-center">
          <Suspense fallback={
            <div className="w-full max-w-md p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
