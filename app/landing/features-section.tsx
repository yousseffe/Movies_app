"use client"

import { useLanguage } from "@/contexts/language-context"
import { Users, Monitor, Star, Film } from "lucide-react"

export function FeaturesSection() {
  const { language, t } = useLanguage()

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: t("home.features.community"),
      description: t("home.features.community.desc"),
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: t("home.features.access"),
      description: t("home.features.access.desc"),
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: t("home.features.recommendations"),
      description: t("home.features.recommendations.desc"),
    },
    {
      icon: <Film className="h-6 w-6" />,
      title: t("home.features.library"),
      description: t("home.features.library.desc"),
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t("home.features.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("home.features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

