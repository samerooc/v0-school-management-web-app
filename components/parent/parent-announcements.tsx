import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Bell, AlertCircle, Calendar } from "lucide-react"

export default async function ParentAnnouncements() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("published", true)
    .or('target_audience.cs.{"all"},target_audience.cs.{"parents"}')
    .order("publish_date", { ascending: false })
    .limit(20)

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: "destructive",
      high: "default",
      medium: "secondary",
      low: "outline",
    }
    return colors[priority] || "secondary"
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent" || priority === "high") {
      return <AlertCircle className="h-4 w-4" />
    }
    return <Bell className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          School Announcements & Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements && announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(announcement.priority)}
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                  </div>
                  <Badge
                    variant={
                      getPriorityColor(announcement.priority) as "default" | "secondary" | "destructive" | "outline"
                    }
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-3 whitespace-pre-line">{announcement.content}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {announcement.publish_date && format(new Date(announcement.publish_date), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No announcements at this time</p>
        )}
      </CardContent>
    </Card>
  )
}
