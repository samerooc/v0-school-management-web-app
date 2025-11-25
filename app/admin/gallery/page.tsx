import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import GalleryManager from "@/components/admin/gallery-manager"

export default async function GalleryManagementPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: images } = await supabase.from("gallery_images").select("*").order("display_order", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-sm text-gray-600">Upload and manage school gallery images</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <GalleryManager images={images || []} />
      </main>
    </div>
  )
}
