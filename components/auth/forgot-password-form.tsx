"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { requestPasswordReset } from "@/app/actions/auth"

export function ForgotPasswordForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await requestPasswordReset(email)

      // Always show success even if email doesn't exist (for security)
      setIsSubmitted(true)
      toast({
        title: t("toast.resetLinkSent"),
        description: t("toast.resetLinkDescription"),
      })
    } catch (error) {
      console.error("Error requesting password reset:", error)
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("forgetPassword.title")}</CardTitle>
        <CardDescription>{t("forgetPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-full bg-green-100 p-3 text-green-600 mx-auto w-fit dark:bg-green-900 dark:text-green-100">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium">{t("forgetPassword.checkEmailTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("forgetPassword.checkEmailDescription")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("forgetPassword.emailLabel")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder={t("forgetPassword.emailPlaceholder")}
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="pl-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("forgetPassword.sendingButton") : t("forgetPassword.sendButton")}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          {t("forgetPassword.rememberPassword")}{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("forgetPassword.backToLogin")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

