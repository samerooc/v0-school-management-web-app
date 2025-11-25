"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string | null
  display_order: number
}

interface GalleryManagerProps {
  images: GalleryImage[]
}

export default function GalleryManager({ images }: GalleryManagerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const fileData = new FormData()
      fileData.append("file", formData.file)
      fileData.append("title", formData.title)
      fileData.append("description", formData.description)
      fileData.append("category", formData.category)

      const response = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        body: fileData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload image")
      }

      setIsOpen(false)
      setFormData({ title: "", description: "", category: "", file: null })
      router.refresh()
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete image")

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gallery Images</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Image</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Image File</Label>
                    <Input id="file" type="file" accept="image/*" onChange={handleFileChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Image title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Image description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Campus, Events, Sports"
                    />
                  </div>
                  {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={image.title || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    {image.title && <h3 className="font-semibold text-sm mb-1">{image.title}</h3>}
                    {image.category && <p className="text-xs text-gray-600 mb-2">{image.category}</p>}
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(image.id)}>
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No images uploaded yet. Click "Upload Image" to add gallery images.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
