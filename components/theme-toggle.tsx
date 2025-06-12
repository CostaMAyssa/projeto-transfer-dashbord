"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para alternar o tema
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full flex items-center justify-center opacity-0" aria-label="Alternar tema">
        <span className="sr-only">Alternar tema</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center hover:shadow-sm dark:hover:shadow-md transition-all"
      aria-label="Alternar tema"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5 text-white" strokeWidth={1} />
      ) : (
        <Moon className="h-5 w-5 text-black" strokeWidth={1} />
      )}
      <span className="sr-only">Alternar tema</span>
    </button>
  )
}
