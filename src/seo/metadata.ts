import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

interface BuildMetadataOptions {
  title: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
}

/**
 * Every route's `generateMetadata`/`metadata` should funnel through this so
 * title templates, canonical URLs, and OG/Twitter cards stay consistent
 * without each page re-deriving them.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString()
  const imageUrl = image.startsWith("http") ? image : new URL(image, siteConfig.url).toString()

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "modern Asian fine dining",
    "luxury restaurant",
    "fine dining New York",
    "chef's tasting menu",
    "private dining",
    siteConfig.name,
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  ...buildMetadata({ title: siteConfig.name }),
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}
