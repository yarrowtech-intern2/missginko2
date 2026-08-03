"use client"

import { useEffect, useState } from "react"

import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { getAdminGalleryImages, type AdminGalleryImage } from "@/services/admin.service"

export default function AdminGalleryPage() {
  const [images, setImages] = useState<AdminGalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadImages() {
      try {
        const nextImages = await getAdminGalleryImages()
        if (active) setImages(nextImages)
      } catch (error) {
        console.error("Failed to load gallery image metadata:", error)
        if (active) setError("Could not load gallery metadata.")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadImages()

    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Read-only URL metadata. No image uploads or Supabase Storage files are used."
      />

      {error && (
        <p className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Alt text</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {images.map((image) => (
              <tr key={image.id}>
                <td className="px-4 py-3">{image.title ?? "-"}</td>
                <td className="px-4 py-3 capitalize">{image.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{image.alt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Loading gallery metadata...
          </p>
        )}
        {!loading && images.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No images yet.</p>
        )}
      </div>
    </div>
  )
}
