import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DM_Sans, Chivo } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
})

const chivo = Chivo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chivo",
})

export const metadata: Metadata = {
  title: "AZ Transfer | Transporte Executivo Premium",
  description:
    "Serviços de transporte executivo de luxo em Nova York. Reserve seu transfer com motoristas profissionais e veículos de alta qualidade.",
  keywords: [
    "transporte executivo",
    "transfer nova york",
    "motorista particular",
    "serviço de carro de luxo",
    "AZ Transfer",
  ],
  authors: [{ name: "AZ Transfer" }],
  openGraph: {
    title: "AZ Transfer | Transporte Executivo Premium",
    description:
      "Serviços de transporte executivo de luxo em Nova York. Reserve seu transfer com motoristas profissionais e veículos de alta qualidade.",
    images: [{ url: "/images/az-logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AZ Transfer | Transporte Executivo Premium",
    description:
      "Serviços de transporte executivo de luxo em Nova York. Reserve seu transfer com motoristas profissionais e veículos de alta qualidade.",
    images: ["/images/az-logo.png"],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className={`${dmSans.variable} ${chivo.variable}`}>
      <body>{children}</body>
    </html>
  )
}