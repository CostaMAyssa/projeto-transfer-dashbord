"use client"

import { useEffect, useRef, type ReactNode, useState } from "react"

interface AnimateOnScrollProps {
  children: ReactNode
  animation: "fade-up" | "fade-in" | "slide-in-left" | "slide-in-right" | "zoom-in"
  delay?: number
  threshold?: number
  className?: string
  mobileAnimation?: boolean // Nova propriedade para controlar animações em mobile
}

export default function AnimateOnScroll({
  children,
  animation,
  delay = 0,
  threshold = 0.1,
  className = "",
  mobileAnimation = true, // Por padrão, animações estão ativadas em mobile
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Detectar se é dispositivo móvel
  useEffect(() => {
    if (!isClient) return

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return

    // Se for mobile e mobileAnimation for false, não aplicar animação
    if (isMobile && !mobileAnimation) {
      if (ref.current) {
        ref.current.classList.add("animate")
      }
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate")
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin: isMobile ? "0px 0px -10px 0px" : "0px 0px -50px 0px", // Ajuste para mobile
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay, threshold, isMobile, mobileAnimation, isClient])

  // Aplicar a classe de animação imediatamente se não estivermos no cliente
  if (!isClient) {
    return <div className={`${className}`}>{children}</div>
  }

  return (
    <div ref={ref} className={`animate-${animation} ${className}`}>
      {children}
    </div>
  )
}
