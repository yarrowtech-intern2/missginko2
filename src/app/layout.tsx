import type { Metadata } from "next"

import "./globals.css"

import { Geist_Mono } from "next/font/google"

import { CursorProvider } from "@/components/common/cursor-provider"
import { Footer } from "@/components/layout/footer"
import { FooterVisibility } from "@/components/layout/footer-visibility"
import { Loader } from "@/components/layout/loader"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/sonner"
import { LenisProvider } from "@/animations/lenis"
import { fontBody, fontCurtain, fontDisplay } from "@/lib/fonts"
import { defaultMetadata } from "@/seo/metadata"
import { restaurantJsonLd } from "@/seo/jsonld"

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontCurtain.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <LenisProvider>
          <CursorProvider>
            <Loader />
            <Navbar />
            <main className="flex-1">{children}</main>
            <FooterVisibility>
              <Footer />
            </FooterVisibility>
          </CursorProvider>
        </LenisProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
