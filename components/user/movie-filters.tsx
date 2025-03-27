"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

export function MovieFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()

  const [genres, setGenres] = useState<any[]>([])
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedYears, setSelectedYears] = useState<number[]>([])

  useEffect(() => {
    // Fetch genres
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error("Error fetching genres:", err))

    // Generate years (e.g., last 50 years)
    const currentYear = new Date().getFullYear()
    const yearsList = Array.from({ length: 50 }, (_, i) => currentYear - i)
    setYears(yearsList)

    // Get selected filters from URL
    const genreParams = searchParams.get("genres")
    if (genreParams) {
      setSelectedGenres(genreParams.split(","))
    }

    const yearParams = searchParams.get("years")
    if (yearParams) {
      setSelectedYears(yearParams.split(",").map(Number))
    }
  }, [searchParams])

  const handleGenreChange = (genreId: string, checked: boolean) => {
    setSelectedGenres((prev) => (checked ? [...prev, genreId] : prev.filter((id) => id !== genreId)))
  }

  const handleYearChange = (year: number, checked: boolean) => {
    setSelectedYears((prev) => (checked ? [...prev, year] : prev.filter((y) => y !== year)))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","))
    }

    if (selectedYears.length > 0) {
      params.set("years", selectedYears.join(","))
    }

    router.push(`/movies?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedGenres([])
    setSelectedYears([])
    router.push("/movies")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">{language === "ar" ? "تصفية حسب" : "Filter By"}</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{language === "ar" ? "النوع" : "Genre"}</h3>
            <div className="space-y-2">
              {genres.map((genre) => (
                <div key={genre._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`genre-${genre._id}`}
                    checked={selectedGenres.includes(genre._id)}
                    onCheckedChange={(checked) => handleGenreChange(genre._id, checked as boolean)}
                  />
                  <Label htmlFor={`genre-${genre._id}`}>
                    {language === "ar" && genre.nameArabic ? genre.nameArabic : genre.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">{language === "ar" ? "السنة" : "Year"}</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {years.slice(0, 10).map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                  />
                  <Label htmlFor={`year-${year}`}>{year}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters}>{language === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}</Button>
        <Button variant="outline" onClick={resetFilters}>
          {language === "ar" ? "إعادة ضبط" : "Reset"}
        </Button>
      </div>
    </div>
  )
}

