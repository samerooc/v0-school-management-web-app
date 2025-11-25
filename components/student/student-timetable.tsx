import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface StudentTimetableProps {
  className: string
  section?: string
}

export default async function StudentTimetable({ className, section }: StudentTimetableProps) {
  const supabase = await createClient()

  let query = supabase.from("timetable").select("*, teachers(full_name)").eq("class", className)

  if (section) {
    query = query.eq("section", section)
  }

  const { data: timetable } = await query.order("day_of_week").order("period_number")

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const groupedByDay = timetable?.reduce(
    (acc, item) => {
      const day = days[item.day_of_week]
      if (!acc[day]) acc[day] = []
      acc[day].push(item)
      return acc
    },
    {} as Record<string, typeof timetable>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Timetable</CardTitle>
      </CardHeader>
      <CardContent>
        {groupedByDay && Object.keys(groupedByDay).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedByDay).map(([day, periods]) => (
              <div key={day}>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">{day}</h3>
                <div className="space-y-2">
                  {periods.map((period) => (
                    <div key={period.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">Period {period.period_number}</Badge>
                          <h4 className="font-semibold">{period.subject}</h4>
                        </div>
                        <p className="text-sm text-gray-600">Teacher: {period.teachers?.full_name || "TBA"}</p>
                        {period.room_number && <p className="text-sm text-gray-600">Room: {period.room_number}</p>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          {period.start_time} - {period.end_time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No timetable available for your class</p>
        )}
      </CardContent>
    </Card>
  )
}
