"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resetPassword, verifyResetToken } from "@/app/actions/auth"
import { useLanguage } from "@/contexts/language-context"

export function ResetPasswordForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState(false)
  const [tokenError, setTokenError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    setToken(tokenParam)

    if (!tokenParam) {
      setIsVerifying(false)
      setTokenValid(false)
      setTokenError(t("resetPassword.invalidLinkMessage"))
      return
    }

    const verifyToken = async () => {
      try {
        const result = await verifyResetToken(tokenParam)

        if (result.success) {
          setTokenValid(true)
        } else {
          setTokenError(result.error || t("resetPassword.invalidLinkMessage"))
        }
      } catch (error) {
        console.error("Error verifying token:", error)
        setTokenError(t("resetPassword.invalidLinkMessage"))
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [searchParams, t])

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError(t("resetPassword.passwordTooShort"))
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError(t("resetPassword.passwordMismatch"))
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validatePassword() || !token) {
      return
    }

    setIsLoading(true)

    try {
      const result = await resetPassword(token, password, confirmPassword)

      if (result.success) {
        toast({
          title: t("resetPassword.resetSuccessTitle"),
          description: t("resetPassword.resetSuccessMessage"),
        })
        router.push("/login")
      } else {
        setPasswordError(result.error || t("resetPassword.errorMessage"))
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      toast({
        title: t("resetPassword.errorTitle"),
        description: t("resetPassword.errorMessage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t("resetPassword.verifyingToken")}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tokenValid) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t("resetPassword.invalidLinkTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{tokenError}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/forgot-password")}>
              {t("resetPassword.requestNewLink")}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("resetPassword.title")}</CardTitle>
        <CardDescription>{t("resetPassword.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {passwordError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{passwordError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("resetPassword.newPasswordLabel")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                className="pl-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("resetPassword.confirmPasswordLabel")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                className="pl-10"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("resetPassword.resettingButton") : t("resetPassword.resetButton")}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">{t("resetPassword.passwordRequirement")}</p>
      </CardFooter>
    </Card>
  )
}
