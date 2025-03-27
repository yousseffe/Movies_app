"use client"

import Link from "next/link"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { deleteMovie } from "@/app/actions/movie"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AdminMoviesTableProps {
  movies: any[]
}

export function AdminMoviesTable({ movies }: AdminMoviesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const { language } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  const itemsPerPage = 10

  // Filter movies based on search term
  const filteredMovies = movies.filter((movie) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      movie.title?.toLowerCase().includes(searchLower) ||
      movie.titleArabic?.toLowerCase().includes(searchLower) ||
      movie.year?.toString().includes(searchTerm)
    )
  })

  // Paginate movies
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage)
  const paginatedMovies = filteredMovies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDelete = async (id: string) => {
    if (
      confirm(language === "ar" ? "هل أنت متأكد من حذف هذا الفيلم؟" : "Are you sure you want to delete this movie?")
    ) {
      try {
        await deleteMovie(id)
        toast({
          title: language === "ar" ? "تم الحذف بنجاح" : "Deleted successfully",
          description: language === "ar" ? "تم حذف الفيلم بنجاح" : "The movie has been deleted successfully",
        })
        router.refresh()
      } catch (error) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "خطأ" : "Error",
          description: language === "ar" ? "حدث خطأ أثناء حذف الفيلم" : "An error occurred while deleting the movie",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={language === "ar" ? "البحث عن فيلم..." : "Search movies..."}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{language === "ar" ? "الإجراءات" : "Actions"}</TableHead>
              <TableHead>{language === "ar" ? "الحالة" : "Status"}</TableHead>
              <TableHead>{language === "ar" ? "السنة" : "Year"}</TableHead>
              <TableHead>{language === "ar" ? "العنوان (بالعربية)" : "Title (Arabic)"}</TableHead>
              <TableHead>{language === "ar" ? "العنوان (بالإنجليزية)" : "Title (English)"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {language === "ar" ? "لا توجد أفلام" : "No movies found"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedMovies.map((movie) => (
                <TableRow key={movie._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/movies/${movie._id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">{language === "ar" ? "عرض" : "View"}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/movies/edit/${movie._id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{language === "ar" ? "تعديل" : "Edit"}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(movie._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{language === "ar" ? "حذف" : "Delete"}</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={movie.published ? "default" : "secondary"}>
                      {movie.published
                        ? language === "ar"
                          ? "منشور"
                          : "Published"
                        : language === "ar"
                          ? "مسودة"
                          : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{movie.year || "-"}</TableCell>
                  <TableCell dir="rtl">{movie.titleArabic || "-"}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {language === "ar"
              ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(currentPage * itemsPerPage, filteredMovies.length)} من ${filteredMovies.length} فيلم`
              : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredMovies.length)} of ${filteredMovies.length} movies`}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{language === "ar" ? "الصفحة السابقة" : "Previous Page"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">{language === "ar" ? "الصفحة التالية" : "Next Page"}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

