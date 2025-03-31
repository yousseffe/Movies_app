"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { createGenre } from "@/app/actions/genre"

export default function AddGenrePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(true)
  const [errors, setErrors] = useState({
    nameEnglish: "",
    nameArabic: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  // Validation functions
  const isEnglish = (text: string) => {
    // Check if text contains only English characters, numbers, and common punctuation
    const englishRegex = /^[A-Za-z0-9\s.,!?&()\-_]+$/
    return englishRegex.test(text)
  }

  const isArabic = (text: string) => {
    // Check if text contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0870-\u089F\s.,!?&()\-_]+$/
    return arabicRegex.test(text)
  }

  const validateForm = (formData: FormData) => {
    const nameEnglish = formData.get("nameEnglish") as string
    const nameArabic = formData.get("nameArabic") as string
    let isValid = true
    const newErrors = {
      nameEnglish: "",
      nameArabic: "",
    }

    if (!isEnglish(nameEnglish)) {
      newErrors.nameEnglish = "Please enter English characters only"
      isValid = false
    }

    if (!isArabic(nameArabic)) {
      newErrors.nameArabic = "Please enter Arabic characters only"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    // Validate form before submission
    if (!validateForm(formData)) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    formData.set("status", status.toString())

    const result = await createGenre(formData)

    setIsLoading(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Genre has been added successfully.",
    })
    router.push("/admin/genre")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Add New Genre</h2>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Genre Information</CardTitle>
            <CardDescription>Add a new genre to the system. Genres are used to categorize movies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nameEnglish">Name (English)</Label>
              <Input
                id="nameEnglish"
                name="nameEnglish"
                placeholder="Enter genre name in English"
                required
                disabled={isLoading}
                onChange={(e) => {
                  if (!isEnglish(e.target.value) && e.target.value !== "") {
                    setErrors((prev) => ({ ...prev, nameEnglish: "Please enter English characters only" }))
                  } else {
                    setErrors((prev) => ({ ...prev, nameEnglish: "" }))
                  }
                }}
                className={errors.nameEnglish ? "border-red-500" : ""}
              />
              {errors.nameEnglish && <p className="text-sm text-red-500 mt-1">{errors.nameEnglish}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameArabic">Name (Arabic)</Label>
              <Input
                id="nameArabic"
                name="nameArabic"
                placeholder="Enter genre name in Arabic"
                required
                disabled={isLoading}
                onChange={(e) => {
                  if (!isArabic(e.target.value) && e.target.value !== "") {
                    setErrors((prev) => ({ ...prev, nameArabic: "Please enter Arabic characters only" }))
                  } else {
                    setErrors((prev) => ({ ...prev, nameArabic: "" }))
                  }
                }}
                className={errors.nameArabic ? "border-red-500" : ""}
              />
              {errors.nameArabic && <p className="text-sm text-red-500 mt-1">{errors.nameArabic}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="status" checked={status} onCheckedChange={setStatus} disabled={isLoading} />
              <Label htmlFor="status">Active</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/admin/genre">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Genre"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

