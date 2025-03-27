"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

// Team member data
const teamMembers = [
  {
    name: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    role: "Founder & CEO",
    roleAr: "المؤسس والرئيس التنفيذي",
    bio: "Passionate about movies and technology, Ahmed founded Sanapel to bring quality cinema to everyone.",
    bioAr: "شغوف بالأفلام والتكنولوجيا، أسس أحمد سنابل لتقديم سينما عالية الجودة للجميع.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      twitter: "https://twitter.com/ahmed",
      linkedin: "https://linkedin.com/in/ahmed",
      github: "https://github.com/ahmed",
    },
  },
  {
    name: "Sara Ali",
    nameAr: "سارة علي",
    role: "Chief Content Officer",
    roleAr: "مديرة المحتوى",
    bio: "With over 10 years in the film industry, Sara curates our movie collection and ensures quality content.",
    bioAr: "مع أكثر من 10 سنوات في صناعة الأفلام، تقوم سارة بتنظيم مجموعة أفلامنا وضمان جودة المحتوى.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      twitter: "https://twitter.com/sara",
      linkedin: "https://linkedin.com/in/sara",
    },
  },
  {
    name: "Omar Khalid",
    nameAr: "عمر خالد",
    role: "CTO",
    roleAr: "المدير التقني",
    bio: "Omar leads our technical team, ensuring the platform runs smoothly and securely for all users.",
    bioAr: "يقود عمر فريقنا التقني، ويضمن تشغيل المنصة بسلاسة وأمان لجميع المستخدمين.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      github: "https://github.com/omar",
      linkedin: "https://linkedin.com/in/omar",
    },
  },
  {
    name: "Layla Hassan",
    nameAr: "ليلى حسن",
    role: "Marketing Director",
    roleAr: "مديرة التسويق",
    bio: "Layla brings our platform to movie enthusiasts worldwide through innovative marketing strategies.",
    bioAr: "تجلب ليلى منصتنا إلى عشاق الأفلام في جميع أنحاء العالم من خلال استراتيجيات تسويقية مبتكرة.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      twitter: "https://twitter.com/layla",
      linkedin: "https://linkedin.com/in/layla",
    },
  },
  {
    name: "Karim Nour",
    nameAr: "كريم نور",
    role: "UX Designer",
    roleAr: "مصمم تجربة المستخدم",
    bio: "Karim designs the user experience, making our platform intuitive and enjoyable for all users.",
    bioAr: "يصمم كريم تجربة المستخدم، مما يجعل منصتنا بديهية وممتعة لجميع المستخدمين.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      twitter: "https://twitter.com/karim",
      github: "https://github.com/karim",
    },
  },
  {
    name: "Nadia Mahmoud",
    nameAr: "نادية محمود",
    role: "Content Curator",
    roleAr: "منسقة المحتوى",
    bio: "Nadia selects and organizes our movie collection, ensuring diversity and quality in our offerings.",
    bioAr: "تختار نادية وتنظم مجموعة أفلامنا، مما يضمن التنوع والجودة في عروضنا.",
    avatar: "/placeholder.svg?height=200&width=200",
    social: {
      linkedin: "https://linkedin.com/in/nadia",
    },
  },
]

export default function PeoplePage() {
  const { language } = useLanguage()

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {language === "en" ? "Meet Our Team" : "تعرف على فريقنا"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {language === "en"
              ? "The passionate individuals behind Sanapel, working together to bring you the best movie experience."
              : "الأشخاص المتحمسون وراء سنابل، يعملون معًا لتقديم أفضل تجربة أفلام لك."}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={member.avatar} alt={language === "en" ? member.name : member.nameAr} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{language === "en" ? member.name : member.nameAr}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "en" ? member.role : member.roleAr}
                  </p>
                  <p className="text-sm mb-6">{language === "en" ? member.bio : member.bioAr}</p>

                  <div className="flex">
                    {member.social.twitter && (
                      <Link
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary me-4 "
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </Link>
                    )}
                    {member.social.linkedin && (
                      <Link
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary me-4 "
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </Link>
                    )}
                    {member.social.github && (
                      <Link
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary "
                      >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

