"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Event {
  id?: string
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  event_type: string
  is_featured: boolean
  is_active: boolean
}

interface EventManagerProps {
  events: Event[]
}

export default function EventManager({ events: initialEvents }: EventManagerProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    event_type: "general",
    is_featured: false,
    is_active: true,
  })

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/website-builder/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      })

      if (response.ok) {
        const data = await response.json()
        setEvents([...events, data])
        setNewEvent({
          title: "",
          description: "",
          event_date: "",
          event_time: "",
          location: "",
          event_type: "general",
          is_featured: false,
          is_active: true,
        })
        router.refresh()
      }
    } catch (error) {
      console.error("Add event error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/website-builder/events/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Delete event error:", error)
    }
  }

  const eventTypeColors: Record<string, string> = {
    general: "bg-gray-100 text-gray-800",
    academic: "bg-blue-100 text-blue-800",
    sports: "bg-green-100 text-green-800",
    cultural: "bg-purple-100 text-purple-800",
    holiday: "bg-red-100 text-red-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Event</CardTitle>
          <CardDescription>Create events for school calendar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Annual Sports Day"
              />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Event description..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Input
                type="date"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Event Time</Label>
              <Input
                type="time"
                value={newEvent.event_time}
                onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="e.g., School Auditorium"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={newEvent.is_featured}
                onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_featured: checked })}
              />
              <Label>Featured Event</Label>
            </div>
          </div>

          <Button onClick={handleAddEvent} disabled={isLoading || !newEvent.title || !newEvent.event_date}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Event
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Manage school events</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No events added yet</p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className={`px-2 py-0.5 text-xs rounded ${eventTypeColors[event.event_type]}`}>
                        {event.event_type}
                      </span>
                      {event.is_featured && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">Featured</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.event_date && format(new Date(event.event_date), "MMM dd, yyyy")}
                      </span>
                      {event.event_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.event_time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                    </div>
                    {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => event.id && handleDeleteEvent(event.id)}>
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
