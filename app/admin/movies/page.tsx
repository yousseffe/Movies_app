import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { deleteMovie } from "@/app/actions/movie"
import { revalidatePath } from "next/cache"
import { getMovies } from "@/app/actions/movie"

// Convert to a server component for more reliable data fetching
export default async function MoviesPage() {
  // Fetch movies server-side
  const result = await getMovies()
  const movies = result.success ? result.data : []

  // Server action for delete
  const handleDelete = async (id: string) => {
    "use server"
    const result = await deleteMovie(id)
    if (result.success) {
      revalidatePath("/admin/movies")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/admin/movies/create">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Movies</CardTitle>
          <CardDescription>Add, edit or remove movies from your collection.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Title (English)
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title (Arabic)</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Year</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {movies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No movies found. Add your first movie to get started.
                    </td>
                  </tr>
                ) : (
                  movies.map((movie) => (
                    <tr
                      key={movie._id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{movie.titleEnglish}</td>
                      <td className="p-4 align-middle">{movie.titleArabic}</td>
                      <td className="p-4 align-middle">{movie.year}</td>
                      <td className="p-4 align-middle">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            movie.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {movie.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950"
                            asChild
                          >
                            <Link href={`/admin/movies/${movie._id}`}>
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"
                            asChild
                          >
                            <Link href={`/admin/movies/edit/${movie._id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Link>
                          </Button>
                          <form action={handleDelete.bind(null, movie._id)}>
                            <Button
                              variant="outline"
                              size="sm"
                              type="submit"
                              className="h-8 gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

