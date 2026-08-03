import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

const staticRoutes = [
  "",
  "/about",
  "/menu",
  "/gallery",
  "/private-events",
  "/reviews",
  "/booking",
  "/contact",
  "/faq",
]

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }))
}
