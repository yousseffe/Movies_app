"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, Trash, Star } from "lucide-react"
import { createMovie, updateMovie } from "@/app/actions/movie"
import { uploadImage } from "@/lib/cloudinary"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"

const movieSchema = z.object({
  titleEnglish: z.string().min(1, "Title is required"),
  titleArabic: z.string().min(1, "Title is required"),
  year: z.number().min(1, "Year is required"),
  budget: z.number().min(0, "Budget must be at least 0"),
  trailerUrl: z.string().url("Trailer must be a valid URL").optional().or(z.literal("")),
  plotEnglish: z.string().min(1, "Plot is required"),
  plotArabic: z.string().min(1, "Plot is required"),
  genres: z.array(z.string()).min(1, "At least one genre is required"),
  rating: z.number().min(0).max(10, "Rating must be between 0 and 10"),
  videos: z
    .array(
      z.object({
        title: z.string().min(1, "Video title is required"),
        url: z.string().url("Video URL must be a valid URL"),
        isTrailer: z.boolean().default(false),
      }),
    )
    .optional(),
})

type MovieFormValues = z.infer<typeof movieSchema>

interface MovieFormProps {
  movie?: any
  genres: any[]
  languages: any[]
}

export function MovieForm({ movie, genres, languages }: MovieFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [backdropFile, setBackdropFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>(movie?.poster || "")
  const [backdropPreview, setBackdropPreview] = useState<string>(movie?.backdrop || "")
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: movie
      ? {
          ...movie,
          releaseDate: new Date(movie.releaseDate).toISOString().split("T")[0],
          genres: movie.genres.map((g: any) => g._id || g),
          language: movie.language?._id || movie.language,
          rating: movie.rating || 0,
          videos: movie.videos || [],
        }
      : {
          titleEnglish: "",
          titleArabic: "",
          year: 0,
          budget: 0,
          plotEnglish: "",
          plotArabic: "",
          genres: [],
          rating: 0,
          trailerUrl: "",
          trailer: "",
          videos: [],
        },
  })

  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideo,
  } = useFieldArray({
    control: form.control,
    name: "videos",
  })

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBackdropFile(file)
      setBackdropPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: MovieFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      let posterUrl = posterPreview
      let backdropUrl = backdropPreview

      if (posterFile) {
        const result = await uploadImage(posterFile)
        if (result.error) {
          throw new Error(result.error)
        }
        posterUrl = result.url
      }

      if (backdropFile) {
        const result = await uploadImage(backdropFile)
        if (result.error) {
          throw new Error(result.error)
        }
        backdropUrl = result.url
      }

      const movieData = {
        ...data,
        poster: posterUrl,
        backdrop: backdropUrl,
      }

      if (movie) {
        await updateMovie(movie._id, movieData)
        toast({
          title: "Movie updated",
          description: "The movie has been successfully updated.",
        })
      } else {
        await createMovie(movieData)
        toast({
          title: "Movie created",
          description: "The new movie has been successfully created.",
        })
      }

      router.push("/admin/movies")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the movie")
      toast({
        title: "Error",
        description: "Failed to save the movie. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="titleEnglish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title English</FormLabel>
                <FormControl>
                  <Input placeholder="Movie title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titleArabic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title Arabic</FormLabel>
                <FormControl>
                  <Input placeholder="Movie title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Release year"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget (USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Movie budget"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-10)</FormLabel>
              <div className="flex items-center gap-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={[field.value || 0]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="flex-1"
                  />
                </FormControl>
                <span className="min-w-[3rem] text-center font-medium">{field.value?.toFixed(1) || "0.0"}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="plotEnglish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Plot</FormLabel>
                <FormControl>
                  <Textarea placeholder="Movie plot in English" className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plotArabic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arabic Plot</FormLabel>
                <FormControl>
                  <Textarea placeholder="Movie plot in Arabic" className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="genres"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Genres</FormLabel>
              </div>
              <div className="space-y-2">
                {genres.map((genre) => (
                  <FormField
                    key={genre._id}
                    control={form.control}
                    name="genres"
                    render={({ field }) => {
                      return (
                        <FormItem key={genre._id} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(genre._id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, genre._id])
                                  : field.onChange(field.value?.filter((value) => value !== genre._id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{genre.nameEnglish}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Poster Image</h3>
            <div className="mt-2 flex items-center gap-4">
              {posterPreview && (
                <div className="relative h-40 w-28 overflow-hidden rounded-md border">
                  <img
                    src={posterPreview || "/placeholder.svg"}
                    alt="Poster preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handlePosterChange} className="max-w-sm" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Cover Image</h3>
            <div className="mt-2 flex items-center gap-4">
              {backdropPreview && (
                <div className="relative h-28 w-48 overflow-hidden rounded-md border">
                  <img
                    src={backdropPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleBackdropChange} className="max-w-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Videos</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendVideo({ title: "", url: "", isTrailer: false })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          </div>

          {videoFields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Video {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVideo(index)}>
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name={`videos.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`videos.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`videos.${index}.isTrailer`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>This is a trailer (visible to all users)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : movie ? (
            "Update Movie"
          ) : (
            "Create Movie"
          )}
        </Button>
      </form>
    </Form>
  )
}

