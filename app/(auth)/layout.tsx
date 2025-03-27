"use client"

import type React from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import "../globals.css"
import { usePathname } from "next/navigation"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t, language } = useLanguage()
  const pathname = usePathname()

  const isLoginPage = pathname === "/login"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-xl font-bold">{language === "en" ? "S" : "س"}</span>
            </div>
            <span className="text-xl font-bold">{language === "en" ? "Sanapel" : "سنابل"}</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />

            <div className="hidden md:flex md:gap-4">
              <Button variant={isLoginPage ? "default" : "ghost"} asChild>
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
              <Button variant={!isLoginPage ? "default" : "ghost"} asChild>
                <Link href="/register">{t("nav.signup")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </>
  )
}

