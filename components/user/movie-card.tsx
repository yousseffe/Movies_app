"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

interface MovieCardProps {
  movie: {
    _id: string
    title: string
    titleEnglish?: string
    titleArabic?: string
    posterUrl: string
    releaseDate?: string
    genres?: {
      _id: string
      name: string
      nameEnglish?: string
      nameArabic?: string
    }[]
  }
}

export function MovieCard({ movie }: MovieCardProps) {
  const { language } = useLanguage()

  // For English, prefer titleEnglish if available, otherwise use title
  // For Arabic, prefer titleArabic if available, otherwise use title
  const displayTitle = language === "en" ? movie.titleEnglish || movie.title : movie.titleArabic || movie.title

  return (
    <Link href={`/movies/${movie._id}`}>
      <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
        <div className="aspect-[2/3] relative">
          <Image
            src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
            alt={displayTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1">{displayTitle}</h3>
          {movie.genres && movie.genres.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {movie.genres.slice(0, 2).map((genre, index) => (
                <span key={index}>
                  {index > 0 && ", "}
                  {language === "en" ? genre.nameEnglish || genre.name : genre.nameArabic || genre.name}
                </span>
              ))}
            </p>
          )}
          {movie.releaseDate && (
            <p className="text-sm text-muted-foreground mt-1">{new Date(movie.releaseDate).getFullYear()}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

