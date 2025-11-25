"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Link {
  id?: string
  title: string
  url: string
  link_type: string
  is_active: boolean
  open_in_new_tab: boolean
  display_order: number
}

interface LinkManagerProps {
  links: Link[]
}

export default function LinkManager({ links: initialLinks }: LinkManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [newLink, setNewLink] = useState<Link>({
    title: "",
    url: "",
    link_type: "navigation",
    is_active: true,
    open_in_new_tab: false,
    display_order: links.length,
  })

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/website-builder/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      })

      if (response.ok) {
        const data = await response.json()
        setLinks([...links, data])
        setNewLink({
          title: "",
          url: "",
          link_type: "navigation",
          is_active: true,
          open_in_new_tab: false,
          display_order: links.length + 1,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Add link error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/website-builder/links/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLinks(links.filter((l) => l.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Delete link error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Link</CardTitle>
          <CardDescription>Add navigation, footer, or quick links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Link Title</Label>
              <Input
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="e.g., About Us"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="e.g., /about or https://..."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Link Type</Label>
              <Select value={newLink.link_type} onValueChange={(value) => setNewLink({ ...newLink, link_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="navigation">Navigation Menu</SelectItem>
                  <SelectItem value="footer">Footer Link</SelectItem>
                  <SelectItem value="quick_link">Quick Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Switch
                checked={newLink.open_in_new_tab}
                onCheckedChange={(checked) => setNewLink({ ...newLink, open_in_new_tab: checked })}
              />
              <Label>Open in new tab</Label>
            </div>
            <div className="pt-6">
              <Button onClick={handleAddLink} disabled={isLoading || !newLink.title || !newLink.url}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Links</CardTitle>
          <CardDescription>Manage your website links</CardDescription>
        </CardHeader>
        <CardContent>
          {links.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No links added yet</p>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-gray-500">{link.url}</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">{link.link_type}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => link.id && handleDeleteLink(link.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
