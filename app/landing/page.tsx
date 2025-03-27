"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Film, Monitor, Star, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { useLanguage } from "@/contexts/language-context"

export default function LandingPage() {
  const { data: session } = useSession()
  const isLoggedIn = !!session
  const { t, language } = useLanguage()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
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
            {isLoggedIn ? (
              <div className="hidden md:flex md:gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/movies">{t("nav.movies")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/api/auth/signout">{t("nav.logout")}</Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex md:gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}
            {isLoggedIn ? (
              <Button className="md:hidden" size="sm" asChild>
                <Link href="/api/auth/signout">{t("nav.logout")}</Link>
              </Button>
            ) : (
              <Button className="md:hidden" size="sm" asChild>
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
          <div className="container relative z-10 flex h-full flex-col justify-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t("home.hero.title")}</h1>
              <p className="text-lg text-muted-foreground md:text-xl">{t("home.hero.subtitle")}</p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                {/* {isLoggedIn ? (
                  
                ) : (
                  <Button size="lg" asChild>
                    <Link href="/register">{t("home.hero.getStarted")}</Link>
                  </Button>
                )} */}
                <Button size="lg" asChild>
                    <Link href="/movies">{t("home.hero.browseMovies")}</Link>
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {language === "en" ? "Everything You Need for Movies" : "كل ما تحتاجه للأفلام"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {language === "en"
                ? "Our platform offers a comprehensive set of features for movie lovers"
                : "توفر منصتنا مجموعة شاملة من الميزات لعشاق الأفلام"}
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center">{language === "en" ? "Community" : "مجتمع"}</h3>
              <p className="mt-2 text-muted-foreground text-center">
                {language === "en"
                  ? "Join discussions, share reviews, and connect with other movie enthusiasts."
                  : "انضم إلى المناقشات، شارك المراجعات، وتواصل مع عشاق الأفلام الآخرين."}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center">
                {language === "en" ? "Multi-device Access" : "الوصول عبر أجهزة متعددة"}
              </h3>
              <p className="mt-2 text-muted-foreground text-center">
                {language === "en"
                  ? "Watch your favorite movies on any device, anytime, anywhere."
                  : "شاهد أفلامك المفضلة على أي جهاز، في أي وقت، وفي أي مكان."}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center">
                {language === "en" ? "Personalized Recommendations" : "توصيات مخصصة"}
              </h3>
              <p className="mt-2 text-muted-foreground text-center">
                {language === "en"
                  ? "Get movie suggestions based on your preferences and viewing history."
                  : "احصل على اقتراحات أفلام بناءً على تفضيلاتك وتاريخ المشاهدة."}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
                <Film className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-center">
                {language === "en" ? "Extensive Library" : "مكتبة واسعة"}
              </h3>
              <p className="mt-2 text-muted-foreground text-center">
                {language === "en"
                  ? "Access thousands of movies from various genres, languages, and formats."
                  : "الوصول إلى آلاف الأفلام من مختلف الأنواع واللغات والتنسيقات."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="rounded-lg bg-red-600 p-8 text-white md:p-12">
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <div className={language === "ar" ? "order-2" : ""}>
                <h2 className="text-3xl font-bold tracking-tight">
                  {language === "en"
                    ? "Ready to Start Your Movie Journey?"
                    : "هل أنت مستعد لبدء رحلة الأفلام الخاصة بك؟"}
                </h2>
                <p className="mt-4 text-lg text-white/90">
                  {language === "en"
                    ? "Sign up today and get access to our extensive movie library, personalized recommendations, and more."
                    : "سجل اليوم واحصل على وصول إلى مكتبة الأفلام الواسعة لدينا، والتوصيات المخصصة، والمزيد."}
                </p>
              </div>
              <div
                className={`flex flex-col items-start gap-4 md:items-end md:justify-center ${language === "ar" ? "order-1" : ""}`}
              >
                {isLoggedIn ? (
                  <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100" asChild>
                    <Link href="/movies">{language === "en" ? "Browse Movies" : "تصفح الأفلام"}</Link>
                  </Button>
                ) : (
                  <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100" asChild>
                    <Link href="/register">{language === "en" ? "Create Account" : "إنشاء حساب"}</Link>
                  </Button>
                )}
                {!isLoggedIn && (
                  <p className="text-sm text-white/80">
                    {language === "en" ? "Already have an account? " : "لديك حساب بالفعل؟ "}
                    <Link href="/login" className="underline underline-offset-4">
                      {language === "en" ? "Sign In" : "تسجيل الدخول"}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="text-xl font-bold">{language === "en" ? "S" : "س"}</span>
                </div>
                <span className="text-xl font-bold">{language === "en" ? "Sanapel" : "سنابل"}</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                {language === "en"
                  ? "Your ultimate destination for movies and entertainment."
                  : "وجهتك النهائية للأفلام والترفيه."}
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    {t("nav.home")}
                  </Link>
                </li>
                <li>
                  <Link href="/movies" className="text-muted-foreground hover:text-foreground">
                    {t("nav.movies")}
                  </Link>
                </li>
                <li>
                  <Link href="/people" className="text-muted-foreground hover:text-foreground">
                    {t("nav.people")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">{t("footer.legal")}</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    {t("auth.register.termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    {t("auth.register.privacyPolicy")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-medium">{t("footer.contact")}</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Email: info@sanapel.com</li>
                <li className="text-muted-foreground">Phone: +1 (123) 456-7890</li>
                <li className="text-muted-foreground">Address: 123 Movie St, Hollywood, CA</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {language === "en" ? "Sanapel" : "سنابل"}. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

