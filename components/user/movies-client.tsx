"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SortSelector } from "@/components/sort-selector"
import { useLanguage } from "@/contexts/language-context"

// Update the interface to match our serialized data
interface MoviesPageClientProps {
  movies: {
    id: string
    titleEnglish: string
    titleArabic: string
    year: string | number
    rating?: string | number
    poster?: string
    genres: {
      id: string
      nameEnglish: string
      nameArabic: string
    }[]
  }[]
  genres: {
    id: string
    nameEnglish: string
    nameArabic: string
  }[]
  totalMovies: number
  hasMoreMovies: boolean
  searchParams: {
    genreFilter: string | string[]
    yearFilter: string
    searchFilter: string
    sortFilter: string
    page: number
  }
}

export default function MoviesClient({
  movies,
  genres,
  totalMovies,
  hasMoreMovies,
  searchParams,
}: MoviesPageClientProps) {
  const { genreFilter, yearFilter, searchFilter, sortFilter, page } = searchParams
  const { t, language } = useLanguage()

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{t("movies.title")}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <form action="/movies" method="get">
              <Input
                type="search"
                name="search"
                placeholder={t("movies.search")}
                className="w-full pl-10 sm:w-[300px]"
                defaultValue={searchFilter || ""}
              />
              {/* Preserve existing filters when searching */}
              {sortFilter && <input type="hidden" name="sort" value={sortFilter} />}
              {yearFilter && yearFilter !== "all" && <input type="hidden" name="year" value={yearFilter} />}
              {genreFilter &&
                Array.isArray(genreFilter) &&
                genreFilter.map((g) => <input key={g} type="hidden" name="genre" value={g} />)}
              {genreFilter && !Array.isArray(genreFilter) && <input type="hidden" name="genre" value={genreFilter} />}
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Filters */}
          <div className="rounded-lg border bg-card p-4 shadow-sm md:sticky md:top-4 self-start">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t("movies.filter")}</h2>
              <Button variant="ghost" size="sm" className="h-8 gap-1" asChild>
                <Link href="/movies">
                  <Filter className="h-4 w-4" />
                  <span>{t("movies.reset")}</span>
                </Link>
              </Button>
            </div>

            <form action="/movies" method="get" className="mt-4 space-y-4">
              {/* Genre Filter */}
              <div>
                <h3 className="mb-2 font-medium">{t("movies.genre")}</h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {genres.map((genre) => {
                    const genreId = genre.id
                    const isChecked = Array.isArray(genreFilter)
                      ? genreFilter.includes(genreId)
                      : genreFilter === genreId

                    return (
                      <div key={genreId} className="flex items-center ">
                        <Checkbox
                          id={`genre-${genreId}`}
                          name="genre"
                          value={genreId}
                          defaultChecked={isChecked}
                          className="me-2"
                        />
                        <Label htmlFor={`genre-${genreId}`} className="text-sm font-normal">
                          {language === "en" ? genre.nameEnglish : genre.nameArabic}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="mb-2 font-medium">{t("movies.year")}</h3>
                <Select name="year" defaultValue={yearFilter || "all"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("movies.all_year")}</SelectItem>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preserve sort when applying filters */}
              {sortFilter && <input type="hidden" name="sort" value={sortFilter} />}

              {/* Preserve search when applying filters */}
              {searchFilter && <input type="hidden" name="search" value={searchFilter} />}

              <Button type="submit" className="w-full mt-4">
                {t("movies.apply")}
              </Button>
            </form>
          </div>

          {/* Movies Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{movies.length}</span> results
              </div>
              <form id="sortForm" action="/movies" method="get" className="contents">
                {/* Preserve existing filters when sorting */}
                {searchFilter && <input type="hidden" name="search" value={searchFilter} />}
                {yearFilter && yearFilter !== "all" && <input type="hidden" name="year" value={yearFilter} />}
                {genreFilter &&
                  Array.isArray(genreFilter) &&
                  genreFilter.map((g) => <input key={g} type="hidden" name="genre" value={g} />)}
                {genreFilter && !Array.isArray(genreFilter) && <input type="hidden" name="genre" value={genreFilter} />}
                {page > 1 && <input type="hidden" name="page" value={page.toString()} />}

                {/* Replace the Select component with our Client Component */}
                <SortSelector defaultValue={sortFilter || "newest"} />
              </form>
            </div>

            {movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{t("movies.noResults")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("movies.tryAgain")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {movies.map((movie) => (
                  <Link key={movie.id} href={`/movies/${movie.id}`}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="aspect-[3/3] relative overflow-hidden">
                      <Image
  src={movie.poster || "/placeholder.svg?height=400&width=300"}
  alt={language === "en" ? movie.titleEnglish : movie.titleArabic}
  fill
  className="object-contain rounded-lg"
/>

                        {/* <div className="absolute right-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                          {movie.rating || "N/A"}
                        </div> */}
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium line-clamp-1">
                          {language === "en" ? movie.titleEnglish : movie.titleArabic}
                        </h3>
                        <p className="text-sm text-muted-foreground">{movie.year}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {movie.genres.slice(0, 2).map((genre) => (
                            <span
                              key={genre.id}
                              className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]"
                            >
                              {language === "en" ? genre.nameEnglish : genre.nameArabic}
                            </span>
                          ))}
                          {movie.genres.length > 2 && (
                            <span className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                              +{movie.genres.length - 2}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalMovies > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    {/* Previous Page Button */}
                    <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                      <Link
                        href={{
                          pathname: "/movies",
                          query: {
                            ...(searchFilter && { search: searchFilter }),
                            ...(sortFilter && { sort: sortFilter }),
                            ...(yearFilter && { year: yearFilter }),
                            ...(genreFilter && { genre: genreFilter }),
                            page: Math.max(1, page - 1),
                          },
                        }}
                      >
                        Previous
                      </Link>
                    </Button>

                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, Math.ceil(totalMovies / 12)) }, (_, i) => {
                      const pageNumber = i + 1
                      const isCurrentPage = pageNumber === page

                      // Only show 2 pages before and after current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === Math.ceil(totalMovies / 12) ||
                        (pageNumber >= page - 2 && pageNumber <= page + 2)
                      ) {
                        return (
                          <Button key={pageNumber} variant={isCurrentPage ? "default" : "outline"} size="sm" asChild>
                            <Link
                              href={{
                                pathname: "/movies",
                                query: {
                                  ...(searchFilter && { search: searchFilter }),
                                  ...(sortFilter && { sort: sortFilter }),
                                  ...(yearFilter && { year: yearFilter }),
                                  ...(genreFilter && { genre: genreFilter }),
                                  page: pageNumber,
                                },
                              }}
                            >
                              {pageNumber}
                            </Link>
                          </Button>
                        )
                      }

                      // Show ellipsis for skipped pages
                      if (pageNumber === page - 3 || pageNumber === page + 3) {
                        return (
                          <span key={pageNumber} className="px-2">
                            ...
                          </span>
                        )
                      }

                      return null
                    })}

                    {/* Next Page Button */}
                    <Button variant="outline" size="sm" disabled={!hasMoreMovies} asChild>
                      <Link
                        href={{
                          pathname: "/movies",
                          query: {
                            ...(searchFilter && { search: searchFilter }),
                            ...(sortFilter && { sort: sortFilter }),
                            ...(yearFilter && { year: yearFilter }),
                            ...(genreFilter && { genre: genreFilter }),
                            page: page + 1,
                          },
                        }}
                      >
                        Next
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Remove or comment out the old Load More button */}
            {/* {hasMoreMovies && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="gap-1" asChild>
                  <Link
                    href={{
                      pathname: "/movies",
                      query: {
                        ...(searchFilter && { search: searchFilter }),
                        ...(sortFilter && { sort: sortFilter }),
                        ...(yearFilter && yearFilter !== "all" && { year: yearFilter }),
                        ...(genreFilter && { genre: genreFilter }),
                        page: page + 1,
                      },
                    }}
                  >
                    Load More
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  )
}

