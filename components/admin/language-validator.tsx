"use client"

type ValidationResult = {
  isValid: boolean
  error: string | null
}

export function useLanguageValidator() {
  const isEnglish = (text: string): ValidationResult => {
    // Check if text contains only English characters, numbers, and common punctuation
    const englishRegex = /^[A-Za-z0-9\s.,!?&()\-_]+$/
    return {
      isValid: englishRegex.test(text) || text === "",
      error: englishRegex.test(text) || text === "" ? null : "Please enter English characters only",
    }
  }

  const isArabic = (text: string): ValidationResult => {
    // Check if text contains Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0870-\u089F\s.,!?&()\-_]+$/
    return {
      isValid: arabicRegex.test(text) || text === "",
      error: arabicRegex.test(text) || text === "" ? null : "Please enter Arabic characters only",
    }
  }

  return {
    isEnglish,
    isArabic,
  }
}

