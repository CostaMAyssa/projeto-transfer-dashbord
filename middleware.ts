import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const locales = ["pt", "en", "es"]
const defaultLocale = "pt"

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language") || ""

  // Simple language detection
  if (acceptLanguage.includes("en") && !acceptLanguage.includes("pt") && !acceptLanguage.includes("es")) {
    return "en"
  }

  if (acceptLanguage.includes("es") && !acceptLanguage.includes("pt") && !acceptLanguage.includes("en")) {
    return "es"
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  // Adicionar cabeçalhos para garantir compressão
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("Accept-Encoding", "gzip, deflate, br")

  const { pathname } = request.nextUrl

  // Ignorar rotas do sistema de reservas e do painel administrativo
  if (pathname === "/" || pathname.startsWith("/booking") || pathname.startsWith("/admin")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) {
    // Retornar com os cabeçalhos atualizados
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // Retornar com os cabeçalhos atualizados
  return NextResponse.redirect(request.nextUrl, {
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
    },
  })
}

export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, static files, and assets
    "/((?!_next|api|favicon.ico|img|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico).*)",
  ],
}
