"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
]

const presetThemes = [
  {
    name: "Ocean Blue",
    primary: "#1e40af",
    secondary: "#3b82f6",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#1f2937",
    header: "#1e40af",
    footer: "#1f2937",
  },
  {
    name: "Forest Green",
    primary: "#166534",
    secondary: "#22c55e",
    accent: "#eab308",
    background: "#ffffff",
    text: "#1f2937",
    header: "#166534",
    footer: "#1f2937",
  },
  {
    name: "Royal Purple",
    primary: "#7c3aed",
    secondary: "#a78bfa",
    accent: "#f97316",
    background: "#ffffff",
    text: "#1f2937",
    header: "#7c3aed",
    footer: "#1f2937",
  },
  {
    name: "Sunset Orange",
    primary: "#ea580c",
    secondary: "#fb923c",
    accent: "#0ea5e9",
    background: "#ffffff",
    text: "#1f2937",
    header: "#ea580c",
    footer: "#1f2937",
  },
]

interface ThemeEditorProps {
  theme: any
}

export default function ThemeEditor({ theme }: ThemeEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    primary_color: theme?.primary_color || "#1e40af",
    secondary_color: theme?.secondary_color || "#3b82f6",
    accent_color: theme?.accent_color || "#f59e0b",
    background_color: theme?.background_color || "#ffffff",
    text_color: theme?.text_color || "#1f2937",
    header_bg_color: theme?.header_bg_color || "#1e40af",
    footer_bg_color: theme?.footer_bg_color || "#1f2937",
    font_family: theme?.font_family || "Inter",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/website-builder/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: theme?.id }),
      })

      if (response.ok) {
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error saving theme:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyPreset = (preset: (typeof presetThemes)[0]) => {
    setFormData({
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent,
      background_color: preset.background,
      text_color: preset.text,
      header_bg_color: preset.header,
      footer_bg_color: preset.footer,
      font_family: formData.font_family,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Color Scheme</CardTitle>
          <CardDescription>Customize your website colors</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primary"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondary"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="accent"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="text"
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.text_color}
                    onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="header">Header Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="header"
                    value={formData.header_bg_color}
                    onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.header_bg_color}
                    onChange={(e) => setFormData({ ...formData, header_bg_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer">Footer Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="footer"
                    value={formData.footer_bg_color}
                    onChange={(e) => setFormData({ ...formData, footer_bg_color: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.footer_bg_color}
                    onChange={(e) => setFormData({ ...formData, footer_bg_color: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={formData.font_family}
                onValueChange={(value) => setFormData({ ...formData, font_family: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">Theme saved successfully!</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Theme
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preset Themes</CardTitle>
          <CardDescription>Choose a preset color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {presetThemes.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="p-4 border rounded-lg hover:border-blue-500 transition-colors text-left"
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }} />
                </div>
                <p className="font-medium text-sm">{preset.name}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">Preview</h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: formData.background_color }}>
              <div className="p-3 rounded mb-2" style={{ backgroundColor: formData.header_bg_color }}>
                <span className="text-white text-sm font-medium">Header</span>
              </div>
              <div className="p-3">
                <h3 className="font-bold mb-1" style={{ color: formData.primary_color }}>
                  Primary Heading
                </h3>
                <p style={{ color: formData.text_color }} className="text-sm mb-2">
                  Sample text content
                </p>
                <button
                  className="px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: formData.secondary_color }}
                >
                  Button
                </button>
              </div>
              <div className="p-3 rounded mt-2" style={{ backgroundColor: formData.footer_bg_color }}>
                <span className="text-white text-sm">Footer</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
