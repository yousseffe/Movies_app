"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 bg-[#111827] text-white">
      <div className="container">
        <div
          className={`flex flex-col ${language === "ar" ? "items-end text-right" : "items-start text-left"} md:flex-row md:justify-between md:items-center`}
        >
          <div className={`md:w-1/2 ${language === "ar" ? "md:order-2" : ""}`}>
            <h2 className="text-3xl font-bold mb-4">{t("home.cta.title")}</h2>
            <p className="text-gray-300 mb-6 max-w-md">{t("home.cta.subtitle")}</p>
          </div>

          <div className={`md:w-1/2 ${language === "ar" ? "md:order-1" : ""} flex justify-center md:justify-end`}>
            <Button asChild size="lg" className="mr-4">
              <Link href="/movies">{language === "ar" ? "تصفح الأفلام" : "Browse Movies"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

