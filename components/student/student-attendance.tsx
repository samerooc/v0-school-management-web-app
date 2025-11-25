import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface StudentAttendanceProps {
  studentId: string
}

export default async function StudentAttendance({ studentId }: StudentAttendanceProps) {
  const supabase = await createClient()

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false })
    .limit(30)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      present: "default",
      absent: "destructive",
      late: "secondary",
      excused: "outline",
    }
    return variants[status] || "secondary"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        {attendance && attendance.length > 0 ? (
          <div className="space-y-3">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium">{format(new Date(record.date), "EEEE, MMMM d, yyyy")}</p>
                    {record.notes && <p className="text-sm text-gray-600">{record.notes}</p>}
                  </div>
                </div>
                <Badge variant={getStatusBadge(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No attendance records found</p>
        )}
      </CardContent>
    </Card>
  )
}
