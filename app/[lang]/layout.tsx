import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { DM_Sans } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "AZ Transfer | Executive Transportation", // English version
  description:
    "Luxury executive transportation services in New York. Book your transfer with professional drivers and high-quality vehicles.",
  icons: {
    icon: "/img/favicon.png",
    shortcut: "/img/favicon.png",
    apple: "/img/favicon.png",
  },
  openGraph: {
    title: "AZ Transfer | Executive Transportation",
    description: "Luxury executive transportation services in New York",
    images: ["/img/logo.png"],
  },
  // You can add language-specific keywords and openGraph/twitter details here if needed
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang={params?.lang || "pt"} className={dmSans.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/favicon.png" />
      </head>
      <body className="font-dm-sans">
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          {children}
        </ThemeProvider>

        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '952362313747354');
          fbq('track', 'PageView');
        `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=952362313747354&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </body>
    </html>
  )
}
