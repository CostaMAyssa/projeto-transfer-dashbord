"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface LanguageSwitcherProps {
  currentLang: string
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const languages = [
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
  ]

  const switchLanguage = (lang: string) => {
    if (!isClient) return
    if (lang === currentLang) return

    const newPathname = pathname.replace(`/${currentLang}`, `/${lang}`)
    router.push(newPathname)
  }

  // Função para obter a bandeira do idioma atual
  const getCurrentFlag = () => {
    const language = languages.find((lang) => lang.code === currentLang)
    return language ? language.flag : "🇧🇷"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1.5 sm:p-2 hover:bg-white dark:hover:bg-black hover:shadow-sm transition-all border border-transparent hover:border-gray-200 dark:hover:border-[#333] rounded-full"
        >
          <span
            className="text-base sm:text-lg mr-1.5"
            title={currentLang === "pt" ? "Português" : currentLang === "en" ? "English" : "Español"}
          >
            {getCurrentFlag()}
          </span>
          <span className="text-sm font-medium">
            {currentLang === "pt" ? "Português" : currentLang === "en" ? "English" : "Español"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white dark:bg-black border border-gray-200 dark:border-[#333] shadow-md font-dm-sans rounded-xl p-1 min-w-[100px] sm:min-w-[120px]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`${currentLang === lang.code ? "bg-gray-100 dark:bg-[#111]" : ""} cursor-pointer hover:bg-gray-50 dark:hover:bg-[#111] rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 my-1 transition-all flex items-center gap-1.5 sm:gap-2`}
          >
            <span className="text-base sm:text-lg">{lang.flag}</span>
            <span
              className={`${currentLang === lang.code ? "text-[#E95440] font-medium" : "text-gray-600 dark:text-gray-300"} text-sm`}
            >
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
