import { AdminPageHeader } from "@/features/admin/components/admin-page-header"
import { createClient } from "@/supabase/server"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order")

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Read-only for now — manage images directly in Supabase Studio until the CRUD screens ship."
      />

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
            {(images ?? []).map((image) => (
              <tr key={image.id}>
                <td className="px-4 py-3">{image.title ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{image.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{image.alt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {(images ?? []).length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No images yet.</p>
        )}
      </div>
    </div>
  )
}
