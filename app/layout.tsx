import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DM_Sans, Shippori_Mincho, Chivo } from "next/font/google"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
})

const shippori = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-shippori",
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
    images: [{ url: "/images/az-logo.png" }], // Assuming you have a logo at this path
  },
  twitter: {
    card: "summary_large_image",
    title: "AZ Transfer | Transporte Executivo Premium",
    description:
      "Serviços de transporte executivo de luxo em Nova York. Reserve seu transfer com motoristas profissionais e veículos de alta qualidade.",
    images: ["/images/az-logo.png"], // Assuming you have a logo at this path
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${shippori.variable} ${chivo.variable}`}>
      <body>{children}</body>
    </html>
  )
}

import "./globals.css"
