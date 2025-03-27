"use client"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export function UserFooter() {
  const { t, language } = useLanguage()

  return (
    <footer className="border-t bg-sidebar text-sidebar-foreground">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="text-xl font-bold">{language === "en" ? "S" : "س"}</span>
              </div>
              <span className="text-xl font-bold">{language === "en" ? "Sanapel" : "سنابل"}</span>
            </Link>
            <p className="mt-4 text-sm text-sidebar-muted-foreground">
            {language === "en"
                  ? "Your ultimate destination for movies and entertainment."
                  : "وجهتك النهائية للأفلام والترفيه."}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                {t("nav.movies")}
                </Link>
              </li>
              <li>
                <Link href="/people" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                {t("nav.people")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">{t("footer.legal")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  {t("auth.register.termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                {t("auth.register.privacyPolicy")}
                </Link>
              </li>
              {/* <li>
                <Link href="/cookies" className="text-sidebar-muted-foreground hover:text-sidebar-foreground">
                  Cookie Policy
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">{t("auth.login.email")}: info@sanapel.com</li>
                <li className="text-muted-foreground">{t("footer.phone")}: +1 (123) 456-7890</li>
                <li className="text-muted-foreground">{t("footer.address")}: 123 Movie St, Hollywood, CA</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-sidebar-accent pt-8 text-center text-sm text-sidebar-muted-foreground">
          <p> © {new Date().getFullYear()} Sanapel. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  )
}

