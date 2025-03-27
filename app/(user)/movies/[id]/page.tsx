import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getMovie } from "@/app/actions/movie"
import { notFound } from "next/navigation"
import { addToWatchlist } from "@/app/actions/watchlist"
import { getMovies } from "@/app/actions/movie"
import VideoPlayer from "@/components/video-player"
import MovieAccessChecker from "@/components/movie-access-cheacker"

export default async function MovieDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  try {
    if (!params.id) {
      console.error("Movie ID is missing")
      notFound()
    }

    console.log("Fetching movie with ID:", params.id)
    const result = await getMovie(params.id)
    console.log("Movie fetch result:", result)

    if (!result.success || !result.data) {
      console.error("Failed to fetch movie:", result.error)
      notFound()
    }

    const movie = result.data

    // Get related movies
    let relatedMovies = []
    try {
      const genreIds = Array.isArray(movie.genres)
        ? movie.genres.map((g) => (typeof g === "object" && g !== null ? g._id : g)).filter(Boolean)
        : []

      if (genreIds.length > 0) {
        const relatedMoviesResult = await getMovies({
          status: "published",
          genre: { $in: genreIds },
          sort: "newest",
          limit: 5,
        })

        if (relatedMoviesResult.success && Array.isArray(relatedMoviesResult.data)) {
          relatedMovies = relatedMoviesResult.data.filter((m) => m._id.toString() !== movie._id.toString()).slice(0, 3)
        }
      }
    } catch (error) {
      console.error("Error fetching related movies:", error)
    }

    const requestSuccess = searchParams.requestSuccess === "true"

    // Ensure movie has all required properties with fallbacks
    const safeMovie = {
      _id: movie._id,
      titleEnglish: movie.titleEnglish || "Untitled",
      titleArabic: movie.titleArabic || "",
      year: movie.year || "Unknown",
      budget: movie.budget || 0,
      plotEnglish: movie.plotEnglish || "No description available",
      plotArabic: movie.plotArabic || "No description available",
      poster: movie.poster || "/placeholder.svg?height=600&width=400",
      cover: movie.cover || "/placeholder.svg?height=600&width=1200",
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      videos: Array.isArray(movie.videos) ? movie.videos : [],
    }

    return (
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
            <Image
              src={safeMovie.cover || "/placeholder.svg"}
              alt={safeMovie.titleEnglish}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="container relative -mt-40 z-10">
            <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
              <div className="hidden md:block">
                <div className="overflow-hidden rounded-lg border">
                  <Image
                    src={safeMovie.poster || "/placeholder.svg"}
                    alt={safeMovie.titleEnglish}
                    width={300}
                    height={450}
                    className="h-auto w-full"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  {safeMovie.titleEnglish} ({safeMovie.year})
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span>
                    {safeMovie.genres
                      .map((g) =>
                        typeof g === "object" && g !== null && "nameEnglish" in g ? g.nameEnglish : String(g),
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
                <p className="text-muted-foreground">{safeMovie.plotEnglish}</p>
                <div className="flex flex-wrap gap-3">
                  <form
                    action={async () => {
                      "use server"
                      await addToWatchlist(safeMovie._id)
                    }}
                  >
                    <Button type="submit" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add to Watchlist
                    </Button>
                  </form>
                </div>
                <div className="pt-4">
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-24 font-medium">Budget:</span>
                      <span>{safeMovie.budget ? `$${safeMovie.budget.toLocaleString()}` : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {requestSuccess && (
          <div className="container py-4">
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Your request for access to this movie has been submitted successfully. We'll review it shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <section className="container py-12">
          <Tabs defaultValue="summary">
            <TabsList className="mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="summary" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {safeMovie.genres && safeMovie.genres.length > 0 ? (
                    safeMovie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold"
                      >
                        {typeof genre === "object" && genre !== null && "nameEnglish" in genre
                          ? genre.nameEnglish
                          : String(genre)}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">No genres specified</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">English Plot</h3>
                <p className="text-muted-foreground">{safeMovie.plotEnglish}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Arabic Plot</h3>
                <p className="text-muted-foreground">{safeMovie.plotArabic}</p>
              </div>
            </TabsContent>
            <TabsContent value="videos" className="space-y-8">
              {/* Trailers Section - Always Accessible */}
              {safeMovie.videos && safeMovie.videos.filter((v) => v.isTrailer).length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold mb-4">Trailers</h3>
                  <VideoPlayer videos={safeMovie.videos.filter((v) => v.isTrailer)} movieCover={safeMovie.cover} />
                </div>
              ) : (
                <div className="text-muted-foreground">No trailers available</div>
              )}

              {/* Full Movie Section - Requires Access */}
              {safeMovie.videos && safeMovie.videos.filter((v) => !v.isTrailer).length > 0 ? (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-bold mb-4">Full Movie</h3>
                  <MovieAccessChecker movieId={safeMovie._id.toString()} movieName={safeMovie.titleEnglish}>
                    <VideoPlayer videos={safeMovie.videos.filter((v) => !v.isTrailer)} movieCover={safeMovie.cover} />
                  </MovieAccessChecker>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>

          {/* Related Movies */}
          {relatedMovies.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Related Movies</h2>
                <Link href="/movies" className="text-sm font-medium text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {relatedMovies.map((relatedMovie) => (
                  <Link key={relatedMovie._id.toString()} href={`/movies/${relatedMovie._id}`}>
                    <div className="overflow-hidden rounded-lg transition-all hover:shadow-md">
                      <div className="aspect-[2/3] relative">
                        <Image
                          src={relatedMovie.poster || "/placeholder.svg?height=300&width=200"}
                          alt={relatedMovie.titleEnglish || "Movie"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium line-clamp-1">{relatedMovie.titleEnglish || "Untitled"}</h3>
                        <p className="text-sm text-muted-foreground">{relatedMovie.year || "Unknown"}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    )
  } catch (error) {
    console.error("Error rendering movie detail page:", error)
    notFound()
  }
}

