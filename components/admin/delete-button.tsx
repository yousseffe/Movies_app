"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

export function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      variant="outline"
      size="sm"
      type="submit"
      disabled={pending}
      className="h-8 gap-1 text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      <span>{pending ? "Deleting..." : "Delete"}</span>
    </Button>
  )
}

