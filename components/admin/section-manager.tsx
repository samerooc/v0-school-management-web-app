"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, GripVertical } from "lucide-react"
import { useRouter } from "next/navigation"

interface Section {
  id: string
  section_key: string
  section_title: string
  section_subtitle: string
  is_visible: boolean
  display_order: number
}

interface SectionManagerProps {
  sections: Section[]
}

export default function SectionManager({ sections: initialSections }: SectionManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sections, setSections] = useState(initialSections)

  const handleToggleVisibility = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s)))
  }

  const handleUpdateSection = (id: string, field: string, value: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/website-builder/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sectionLabels: Record<string, string> = {
    hero: "Hero Banner",
    about: "About Section",
    features: "Features Section",
    gallery: "Gallery Section",
    events: "Events Section",
    announcements: "Announcements Section",
    contact: "Contact Section",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Sections</CardTitle>
        <CardDescription>Manage visibility and content of homepage sections</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="h-5 w-5 text-gray-400" />
                <div>
                  <h4 className="font-medium">{sectionLabels[section.section_key] || section.section_key}</h4>
                  <p className="text-sm text-gray-500">Order: {section.display_order}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`visible-${section.id}`} className="text-sm">
                  Visible
                </Label>
                <Switch
                  id={`visible-${section.id}`}
                  checked={section.is_visible}
                  onCheckedChange={() => handleToggleVisibility(section.id)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={section.section_title || ""}
                  onChange={(e) => handleUpdateSection(section.id, "section_title", e.target.value)}
                  placeholder="Enter section title"
                />
              </div>
              <div className="space-y-2">
                <Label>Section Subtitle</Label>
                <Input
                  value={section.section_subtitle || ""}
                  onChange={(e) => handleUpdateSection(section.id, "section_subtitle", e.target.value)}
                  placeholder="Enter section subtitle"
                />
              </div>
            </div>
          </div>
        ))}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">Sections saved successfully!</p>
          </div>
        )}

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
