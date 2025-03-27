"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"

export function SortSelector({
  defaultValue,
}: {
  defaultValue: string
}) {
  const {t , language} = useLanguage()
  return (
    <Select
      name="sort"
      defaultValue={defaultValue}
      onValueChange={() => {
        // This will submit the form when the value changes
        document.getElementById("sortForm")?.requestSubmit()
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">{t("movies.newest")}</SelectItem>
        <SelectItem value="oldest">{t("movies.oldest")}</SelectItem>
      </SelectContent>
    </Select>
  )
}

