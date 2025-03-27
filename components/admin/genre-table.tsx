"use client"

import Link from "next/link"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { deleteGenre } from "@/app/actions/genre"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AdminGenreTableProps {
  genres: any[]
}

export function AdminGenreTable({ genres }: AdminGenreTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { language } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  // Filter genres based on search term
  const filteredGenres = genres.filter((genre) => {
    const searchLower = searchTerm.toLowerCase()
    return genre.name?.toLowerCase().includes(searchLower) || genre.nameArabic?.toLowerCase().includes(searchLower)
  })

  const handleDelete = async (id: string) => {
    if (confirm(language === "ar" ? "هل أنت متأكد من حذف هذا النوع؟" : "Are you sure you want to delete this genre?")) {
      try {
        await deleteGenre(id)
        toast({
          title: language === "ar" ? "تم الحذف بنجاح" : "Deleted successfully",
          description: language === "ar" ? "تم حذف النوع بنجاح" : "The genre has been deleted successfully",
        })
        router.refresh()
      } catch (error) {
        toast({
          variant: "destructive",
          title: language === "ar" ? "خطأ" : "Error",
          description: language === "ar" ? "حدث خطأ أثناء حذف النوع" : "An error occurred while deleting the genre",
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
            placeholder={language === "ar" ? "البحث عن نوع..." : "Search genres..."}
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
              <TableHead>{language === "ar" ? "الاسم (بالعربية)" : "Name (Arabic)"}</TableHead>
              <TableHead>{language === "ar" ? "الاسم (بالإنجليزية)" : "Name (English)"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGenres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  {language === "ar" ? "لا توجد أنواع" : "No genres found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredGenres.map((genre) => (
                <TableRow key={genre._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/genre/edit/${genre._id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{language === "ar" ? "تعديل" : "Edit"}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(genre._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">{language === "ar" ? "حذف" : "Delete"}</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell dir="rtl">{genre.nameArabic || "-"}</TableCell>
                  <TableCell>{genre.name}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

