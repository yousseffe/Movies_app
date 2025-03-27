import { getMovies } from "@/app/actions/movie"
import { getGenres } from "@/app/actions/genre"
import MoviesClient from "@/components/user/movies-client"

const ITEMS_PER_PAGE = 12 // Define how many movies to show per page

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Get filter options
  const result = await getGenres()
  const genres = result.data

  // Get movies with filters
  const genreFilter = searchParams?.genre as string | string[]
  const yearFilter = searchParams?.year as string
  const searchFilter = searchParams?.search as string
  const sortFilter = (searchParams?.sort as string) || "newest" // Default sort is newest
  const page = Number(searchParams?.page) || 1 // Current page for pagination

  // Process genre filter (handle both single and multiple selections)
  const genreQuery = genreFilter
    ? Array.isArray(genreFilter)
      ? { genre: { $in: genreFilter } }
      : { genre: genreFilter }
    : {}

  // Process year filter (skip if "all" is selected)
  const yearQuery = yearFilter && yearFilter !== "all" ? { year: yearFilter } : {}

  // Process search filter
  const searchQuery = searchFilter ? { search: searchFilter } : {}

  // Process sort filter
  const sortQuery = sortFilter === "oldest" ? { sort: "oldest" } : { sort: "newest" }

  // Get total count for pagination
  const countResult = await getMovies({
    status: "published",
    ...genreQuery,
    ...yearQuery,
    ...searchQuery,
    count: true,
  })

  const totalMovies = countResult.success ? countResult.data : 0

  // Get paginated movies
  const moviesResult = await getMovies({
    status: "published",
    ...genreQuery,
    ...yearQuery,
    ...searchQuery,
    ...sortQuery,
    page,
    limit: ITEMS_PER_PAGE,
  })

  const moviesData = moviesResult.success ? moviesResult.data : []
  const hasMoreMovies = totalMovies > page * ITEMS_PER_PAGE

  // Serialize MongoDB objects to plain JavaScript objects
  const serializedMovies = moviesData.map((movie) => ({
    id: movie._id.toString(),
    titleEnglish: movie.titleEnglish,
    titleArabic: movie.titleArabic,
    year: movie.year,
    rating: movie.rating,
    poster: movie.poster,
    genres: movie.genres.map((genre) => ({
      id: genre._id.toString(),
      nameEnglish: genre.nameEnglish,
      nameArabic: genre.nameArabic,
    })),
  }))

  // Serialize genres data
  const serializedGenres = genres.map((genre) => ({
    id: genre._id.toString(),
    nameEnglish: genre.nameEnglish,
    nameArabic: genre.nameArabic,
  }))

  return (
    <MoviesClient
      movies={serializedMovies}
      genres={serializedGenres}
      totalMovies={totalMovies}
      hasMoreMovies={hasMoreMovies}
      searchParams={{
        genreFilter,
        yearFilter,
        searchFilter,
        sortFilter,
        page,
      }}
    />
  )
}

