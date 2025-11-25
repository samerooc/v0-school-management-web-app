import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, CreditCard, GraduationCap, User, Bell, Clock } from "lucide-react"
import StudentAttendance from "@/components/student/student-attendance"
import StudentMarks from "@/components/student/student-marks"
import StudentFees from "@/components/student/student-fees"
import StudentTimetable from "@/components/student/student-timetable"
import StudentAnnouncements from "@/components/student/student-announcements"
import PendingPaymentAlert from "@/components/pending-payment-alert"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/logout-button"

export default async function StudentDashboard() {
  const user = await requireRole(["student"])
  const supabase = await createClient()

  // Get student data
  const { data: student } = await supabase.from("students").select("*").eq("user_id", user.id).single()

  if (!student) {
    redirect("/auth/login")
  }

  // Get attendance summary
  const { data: attendanceRecords } = await supabase.from("attendance").select("status").eq("student_id", student.id)

  const totalDays = attendanceRecords?.length || 0
  const presentDays = attendanceRecords?.filter((a) => a.status === "present").length || 0
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  // Get recent marks
  const { data: recentMarks } = await supabase
    .from("marks")
    .select("*")
    .eq("student_id", student.id)
    .order("exam_date", { ascending: false })
    .limit(3)

  // Get fee status - Enhanced to get pending amount
  const { data: feeRecords } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("student_id", student.id)
    .order("payment_date", { ascending: false })

  const pendingFees = feeRecords?.filter((f) => f.status === "pending" || f.status === "overdue") || []
  const pendingAmount = pendingFees.reduce((sum, f) => sum + Number(f.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {student.full_name}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PendingPaymentAlert pendingAmount={pendingAmount} pendingCount={pendingFees.length} />

        {/* Profile Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student.photo_url || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {student.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{student.full_name}</h2>
                <div className="mt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge variant="secondary">
                    <User className="h-3 w-3 mr-1" />
                    {student.student_id}
                  </Badge>
                  <Badge variant="secondary">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Class {student.class}
                    {student.section && ` - ${student.section}`}
                  </Badge>
                  <Badge variant="secondary">Roll No: {student.roll_number}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                {presentDays} of {totalDays} days present
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Exams</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentMarks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Exams in last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingFees.length === 0 ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-red-600">{pendingFees.length} Pending</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingFees.length === 0 ? "All fees cleared" : `₹${pendingAmount.toLocaleString()} due`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="attendance">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="marks">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Marks</span>
            </TabsTrigger>
            <TabsTrigger value="fees">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Fees</span>
            </TabsTrigger>
            <TabsTrigger value="timetable">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Timetable</span>
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <StudentAttendance studentId={student.id} />
          </TabsContent>

          <TabsContent value="marks">
            <StudentMarks studentId={student.id} />
          </TabsContent>

          <TabsContent value="fees">
            <StudentFees studentId={student.id} />
          </TabsContent>

          <TabsContent value="timetable">
            <StudentTimetable className={student.class} section={student.section || undefined} />
          </TabsContent>

          <TabsContent value="announcements">
            <StudentAnnouncements />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
