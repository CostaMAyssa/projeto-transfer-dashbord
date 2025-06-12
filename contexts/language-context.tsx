"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Locale, getTranslations, type Translations } from "@/lib/i18n"

interface LanguageContextType {
  locale: Locale
  translations: Translations
  changeLanguage: (newLocale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  const [translations, setTranslations] = useState<Translations>(getTranslations("en"))

  // Carregar idioma do localStorage quando o componente montar
  useEffect(() => {
    const savedLocale = localStorage.getItem("language") as Locale | null
    if (savedLocale && ["en", "es", "pt"].includes(savedLocale)) {
      setLocale(savedLocale)
      setTranslations(getTranslations(savedLocale))
    }
  }, [])

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale)
    setTranslations(getTranslations(newLocale))
    localStorage.setItem("language", newLocale)
  }

  return (
    <LanguageContext.Provider value={{ locale, translations, changeLanguage }}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
