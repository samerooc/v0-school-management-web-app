"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomButton {
  id?: string
  button_text: string
  button_url: string
  button_style: string
  section: string
  is_active: boolean
  display_order: number
}

interface ButtonManagerProps {
  buttons: CustomButton[]
}

export default function ButtonManager({ buttons: initialButtons }: ButtonManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [buttons, setButtons] = useState<CustomButton[]>(initialButtons)
  const [newButton, setNewButton] = useState<CustomButton>({
    button_text: "",
    button_url: "",
    button_style: "primary",
    section: "hero",
    is_active: true,
    display_order: buttons.length,
  })

  const handleAddButton = async () => {
    if (!newButton.button_text || !newButton.button_url) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/website-builder/buttons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newButton),
      })

      if (response.ok) {
        const data = await response.json()
        setButtons([...buttons, data])
        setNewButton({
          button_text: "",
          button_url: "",
          button_style: "primary",
          section: "hero",
          is_active: true,
          display_order: buttons.length + 1,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Add button error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteButton = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/website-builder/buttons/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setButtons(buttons.filter((b) => b.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Delete button error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Button</CardTitle>
          <CardDescription>Add buttons to different sections of your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input
                value={newButton.button_text}
                onChange={(e) => setNewButton({ ...newButton, button_text: e.target.value })}
                placeholder="e.g., Learn More"
              />
            </div>
            <div className="space-y-2">
              <Label>Button URL</Label>
              <Input
                value={newButton.button_url}
                onChange={(e) => setNewButton({ ...newButton, button_url: e.target.value })}
                placeholder="e.g., /about"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Button Style</Label>
              <Select
                value={newButton.button_style}
                onValueChange={(value) => setNewButton({ ...newButton, button_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={newButton.section}
                onValueChange={(value) => setNewButton({ ...newButton, section: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Section</SelectItem>
                  <SelectItem value="about">About Section</SelectItem>
                  <SelectItem value="contact">Contact Section</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-6">
              <Button onClick={handleAddButton} disabled={isLoading || !newButton.button_text || !newButton.button_url}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Button
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <Label className="mb-2 block">Preview</Label>
            <Button
              variant={
                newButton.button_style === "outline"
                  ? "outline"
                  : newButton.button_style === "secondary"
                    ? "secondary"
                    : "default"
              }
            >
              {newButton.button_text || "Button Text"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Buttons</CardTitle>
          <CardDescription>Manage your custom buttons</CardDescription>
        </CardHeader>
        <CardContent>
          {buttons.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No buttons added yet</p>
          ) : (
            <div className="space-y-3">
              {buttons.map((button) => (
                <div key={button.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant={
                        button.button_style === "outline"
                          ? "outline"
                          : button.button_style === "secondary"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {button.button_text}
                    </Button>
                    <div className="text-sm text-gray-500">
                      <span>→ {button.button_url}</span>
                      <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">{button.section}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => button.id && handleDeleteButton(button.id)}>
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
