"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"

interface Child {
  id: string
  full_name: string
  class: string
  section: string | null
}

interface ParentChildSelectorProps {
  children: Child[]
  selectedId: string
}

export default function ParentChildSelector({ children, selectedId }: ParentChildSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChildChange = (childId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("child", childId)
    router.push(`/parent?${params.toString()}`)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Users className="h-5 w-5 text-gray-600" />
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Child</label>
            <Select value={selectedId} onValueChange={handleChildChange}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Select a child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.full_name} - Class {child.class}
                    {child.section && ` ${child.section}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
