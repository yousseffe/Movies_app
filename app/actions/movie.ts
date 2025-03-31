"use server"

import connectToDatabase from "@/lib/mongodb"
import Movie from "@/models/Movie"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { uploadImage, uploadVideo, deleteImage, deleteVideo } from "@/lib/cloudinary"
import { revalidatePath } from "next/cache"

export async function createMovie(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    // Extract basic movie data
    const titleEnglish = formData.get("titleEnglish") as string
    const titleArabic = formData.get("titleArabic") as string
    const year = Number.parseInt(formData.get("year") as string)
    const plotEnglish = formData.get("plotEnglish") as string
    const plotArabic = formData.get("plotArabic") as string
    const status = formData.get("status") as "draft" | "published"
    const budget = formData.get("budget") ? Number.parseInt(formData.get("budget") as string) : undefined
    const rating = formData.get("rating") ? Number.parseFloat(formData.get("rating") as string) : 0
    const rawGenres = formData.get("genres")

    let genreIds: string[] = []
    if (typeof rawGenres === "string") {
      try {
        if (rawGenres.startsWith("[") && rawGenres.endsWith("]")) {
          // If it's a JSON array, parse it
          genreIds = JSON.parse(rawGenres)
        } else {
          // If it's a single value, wrap it in an array
          genreIds = [rawGenres]
        }
      } catch (error) {
        console.error("Error parsing genres:", error)
      }
    }

    // Handle file uploads
    let posterUrl = null
    let coverUrl = null
    const posterFile = formData.get("poster") as File
    if (posterFile && posterFile.size > 0) {
      const result = await uploadImage(posterFile)
      posterUrl = result.url
      console.log(posterUrl)
    }

    const coverFile = formData.get("cover") as File
    if (coverFile && coverFile.size > 0) {
      const result = await uploadImage(coverFile)
      coverUrl = result.url
      console.log(coverUrl)
    }

    // Handle videos
    const videosData = JSON.parse((formData.get("videos") as string) || "[]")
    const videos = []

    for (const videoData of videosData) {
      if (videoData.fileIndex !== undefined) {
        // Ensure we are getting the correct file
        const fileKey = `videoFile-${videoData.fileIndex}`

        const videoFile = formData.get(fileKey) as File

        if (videoFile && videoFile.size > 0) {
          try {
            const result = await uploadVideo(videoFile)

            videos.push({
              title: videoData.title,
              url: result.url,
              isTrailer: videoData.isTrailer,
            })
            console.log("videos", videos)
          } catch (error) {
            console.error("Upload failed:", error)
          }
        }
      } else if (videoData.url) {
        console.log("Using URL:", videoData.url)

        videos.push({
          title: videoData.title,
          url: videoData.url,
          isTrailer: videoData.isTrailer,
        })
      } else {
        console.warn("Invalid videoData:", videoData)
      }
    }
    console.log("videos", videos)
    // Create movie object
    const movieData = {
      titleEnglish,
      titleArabic,
      year,
      budget,
      rating,
      genres: genreIds,
      plotEnglish,
      plotArabic,
      poster: posterUrl,
      cover: coverUrl,
      videos,
      status,
    }
    const movie = new Movie(movieData)
    await movie.save()
    console.log("movie saved")

    // Revalidate the movies page to refresh the data
    revalidatePath("/admin/movies")

    return { success: true }
  } catch (error: any) {
    console.error("Error creating movie:", error)
    return { error: "Failed to create movie" }
  }
}

export async function updateMovie(id: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    // Get existing movie to check if we need to delete old images
    const existingMovie = await Movie.findById(id)
    if (!existingMovie) {
      return { error: "Movie not found" }
    }

    // Extract basic movie data
    const titleEnglish = formData.get("titleEnglish") as string
    const titleArabic = formData.get("titleArabic") as string
    const year = Number.parseInt(formData.get("year") as string)
    const plotEnglish = formData.get("plotEnglish") as string
    const plotArabic = formData.get("plotArabic") as string
    const status = formData.get("status") as "draft" | "published"
    const budget = formData.get("budget") ? Number.parseInt(formData.get("budget") as string) : undefined
    const rating = formData.get("rating") ? Number.parseFloat(formData.get("rating") as string) : 0

    // Extract and parse arrays
    const genreIds = JSON.parse((formData.get("genres") as string) || "[]")
    const directorId = formData.get("director") as string
    const writerIds = JSON.parse((formData.get("writers") as string) || "[]")
    const castIds = JSON.parse((formData.get("cast") as string) || "[]")
    const languageId = formData.get("language") as string
    const qualityId = formData.get("quality") as string

    // Handle file uploads
    let posterUrl = existingMovie.poster
    let coverUrl = existingMovie.cover

    const posterFile = formData.get("poster") as File
    if (posterFile && posterFile.size > 0) {
      const result = await uploadImage(posterFile)
      posterUrl = result.url

      // Delete old poster if it exists
      if (existingMovie.poster) {
        // Extract public ID from URL
        const publicId = existingMovie.poster.split("/").slice(-1)[0].split(".")[0]
        await deleteImage(`movie-app/${publicId}`)
      }
    }

    const coverFile = formData.get("cover") as File
    if (coverFile && coverFile.size > 0) {
      const result = await uploadImage(coverFile)
      coverUrl = result.url

      // Delete old cover if it exists
      if (existingMovie.cover) {
        // Extract public ID from URL
        const publicId = existingMovie.cover.split("/").slice(-1)[0].split(".")[0]
        await deleteImage(`movie-app/${publicId}`)
      }
    }

    // Handle videos
    const videosData = JSON.parse((formData.get("videos") as string) || "[]")
    const videos = []

    for (const videoData of videosData) {
      if (videoData.fileIndex !== undefined) {
        // This video has a file upload
        const videoFile = formData.get(`videoFile-${videoData.fileIndex}`) as File
        if (videoFile && videoFile.size > 0) {
          const result = await uploadVideo(videoFile)
          videos.push({
            title: videoData.title,
            url: result.url,
            isTrailer: videoData.isTrailer,
          })
        }
      } else if (videoData.url) {
        // This video has a URL
        videos.push({
          title: videoData.title,
          url: videoData.url,
          isTrailer: videoData.isTrailer,
        })
      }
    }

    // Update movie object
    const movieData = {
      titleEnglish,
      titleArabic,
      year,
      budget,
      rating,
      plotEnglish,
      plotArabic,
      quality: qualityId,
      poster: posterUrl,
      cover: coverUrl,
      videos,
      status,
    }

    const movie = await Movie.findByIdAndUpdate(id, movieData, { new: true })

    // Revalidate the movies page to refresh the data
    revalidatePath("/admin/movies")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating movie:", error)
    return { error: "Failed to update movie" }
  }
}

export async function deleteMovie(id: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return { error: "Unauthorized" }
    }

    await connectToDatabase()

    // Get movie to delete associated images and videos
    const movie = await Movie.findById(id)
    console.log("movie", movie)
    if (!movie) {
      return { error: "Movie not found" }
    }

    // Delete associated images
    if (movie.poster) {
      const publicId = movie.poster.split("/").slice(-1)[0].split(".")[0]
      await deleteImage(`movie-app/${publicId}`)
    }

    if (movie.cover) {
      const publicId = movie.cover.split("/").slice(-1)[0].split(".")[0]
      await deleteImage(`movie-app/${publicId}`)
    }

    // Delete associated videos
    if (movie.videos && movie.videos.length > 0) {
      for (const video of movie.videos) {
        if (video.url && video.url.includes("cloudinary")) {
          const publicId = video.url.split("/").slice(-1)[0].split(".")[0]
          await deleteVideo(`movie-app-videos/${publicId}`)
        }
      }
    }

    // Delete the movie
    await Movie.findByIdAndDelete(id)

    // Revalidate the movies page to refresh the data
    revalidatePath("/admin/movies")

    return { success: true }
  } catch (error) {
    console.error("Error deleting movie:", error)
    return { error: "Failed to delete movie" }
  }
}

export async function getMovies(
  params: {
    status?: string
    genre?: string | { $in: string[] }
    year?: string
    search?: string
    sort?: string
    page?: number
    limit?: number
    count?: boolean
  } = {},
) {
  try {
    const { status, genre, year, search, sort = "newest", page = 1, limit = 12, count = false } = params

    await connectToDatabase()

    // Build query
    const query: any = {}

    if (status) query.status = status

    if (genre) {
      if (typeof genre === "string") {
        query.genres = genre
      } else if (genre.$in && Array.isArray(genre.$in)) {
        query.genres = { $in: genre.$in }
      }
    }

    if (year) query.year = year

    if (search && search.trim()) {
      query.$or = [
        { titleEnglish: { $regex: search, $options: "i" } },
        { titleArabic: { $regex: search, $options: "i" } },
      ]
    }

    // If count is requested, return only the count
    if (count) {
      const totalCount = await Movie.countDocuments(query)
      return { success: true, data: totalCount }
    }

    // Validate pagination inputs
    const validatedPage = isNaN(Number(page)) ? 1 : Math.max(1, Number(page))
    const validatedLimit = isNaN(Number(limit)) ? 12 : Math.max(1, Number(limit))
    const skip = (validatedPage - 1) * validatedLimit

    // Validate sort options
    const validSortOptions = ["newest", "oldest"]
    const appliedSort = validSortOptions.includes(sort) ? sort : "newest"

    const sortOptions: any = appliedSort === "newest" ? { year: -1, createdAt: -1 } : { year: 1, createdAt: 1 }

    // Fetch movies
    const movies = await Movie.find(query).sort(sortOptions).skip(skip).limit(validatedLimit).populate("genres").lean()

    return { success: true, data: JSON.parse(JSON.stringify(movies)) }
  } catch (error) {
    console.error("Error fetching movies:", error)
    return { success: false, error: "Failed to fetch movies" }
  }
}

export async function getMovie(id: string) {
  try {
    if (!id) {
      console.error("No movie ID provided")
      return { success: false, error: "Movie ID is required" }
    }

    await connectToDatabase()

    console.log("Fetching movie with ID:", id)

    // Ensure the ID is valid for MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("Invalid movie ID format:", id)
      return { success: false, error: "Invalid movie ID format" }
    }

    // Create a base query
    const query = Movie.findById(id).populate("genres")

    const movie = await query.lean() // Use lean() to get a plain JavaScript object

    if (!movie) {
      console.error("Movie not found with ID:", id)
      return { success: false, error: "Movie not found" }
    }

    console.log("Movie found:", movie.titleEnglish)

    // Ensure all expected properties exist with defaults
    const safeMovie = {
      ...movie,
      titleEnglish: movie.titleEnglish || "Untitled",
      titleArabic: movie.titleArabic || "",
      year: movie.year || 0,
      budget: movie.budget || 0,
      rating: movie.rating || 0,
      plotEnglish: movie.plotEnglish || "",
      plotArabic: movie.plotArabic || "",
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      videos: Array.isArray(movie.videos) ? movie.videos : [],
      poster: movie.poster || null,
      cover: movie.cover || null,
    }

    return { success: true, data: JSON.parse(JSON.stringify(safeMovie)) }
  } catch (error) {
    console.error("Error fetching movie:", error)
    return { success: false, error: "Failed to fetch movie" }
  }
}

