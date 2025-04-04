"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { register } from "@/app/actions/auth"
import { useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface RegisterState {
  error: string
  success: boolean
}

const initialState: RegisterState = {
  error: "",
  success: false,
}



export default function RegisterPage() {

const { t, language } = useLanguage()
  const [state, setState] = useState<RegisterState>(initialState)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const router = useRouter()
  function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("auth.register.button")}
  
          </>
        ) : (
          t("auth.register.button")

        )}
      </Button>
    )
  }
  useEffect(() => {
    if (state.success) {
      router.push("/login?registered=true")
    }
  }, [state.success, router])

  async function handleSubmit(formData: FormData) {
    const result = await register(state, formData)
    setState(result)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">            {t("auth.register.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
          {t("auth.register.haveAccount")}
          {" "}
            <Link href="/login" className="text-primary hover:underline">
            {t("auth.register.login")}

            </Link>
          </p>
        </div>

        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">            {t("auth.register.name")}
              </Label>
              <Input id="name" name="name" type="text" placeholder="Your name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.register.email")}
              </Label>
              <Input id="email" name="email" type="email" placeholder="username@example.com" required />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">            {t("auth.register.password")}
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-muted-foreground"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? "Hide" : "Show"}
                </Button>
              </div>
              <Input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>
          </div>

          <SubmitButton />

          <p className="text-center text-xs text-muted-foreground">
          {t("auth.register.agreeToTerms")}

            <Link href="/terms" className="text-primary hover:underline">
            {t("auth.register.termsOfService")}

            </Link>{" "}
            ,{" "}
            <Link href="/privacy" className="text-primary hover:underline">
            {t("auth.register.privacyPolicy")}

            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  )
}

