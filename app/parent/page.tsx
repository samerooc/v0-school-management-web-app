import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, GraduationCap, CreditCard, Bell } from "lucide-react"
import ParentChildSelector from "@/components/parent/parent-child-selector"
import ParentChildAttendance from "@/components/parent/parent-child-attendance"
import ParentChildMarks from "@/components/parent/parent-child-marks"
import ParentChildFees from "@/components/parent/parent-child-fees"
import ParentAnnouncements from "@/components/parent/parent-announcements"
import PendingPaymentAlert from "@/components/pending-payment-alert"
import LogoutButton from "@/components/logout-button"
import { redirect } from "next/navigation"

export default async function ParentDashboard({
  searchParams,
}: {
  searchParams: { child?: string }
}) {
  const user = await requireRole(["parent"])
  const supabase = await createClient()

  // Get parent data
  const { data: parent } = await supabase.from("parents").select("*").eq("user_id", user.id).single()

  if (!parent) {
    redirect("/auth/login")
  }

  // Get all children linked to this parent
  const { data: studentParents } = await supabase
    .from("student_parents")
    .select("*, students(*)")
    .eq("parent_id", parent.id)

  const children = studentParents?.map((sp) => sp.students) || []

  // Select the child to display (default to first child)
  const selectedChildId = searchParams.child || children[0]?.id
  const selectedChild = children.find((c) => c.id === selectedChildId) || children[0]

  if (!selectedChild) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Children Linked</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              No students are currently linked to your parent account. Please contact the school administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get attendance summary for selected child
  const { data: attendanceRecords } = await supabase
    .from("attendance")
    .select("status")
    .eq("student_id", selectedChild.id)

  const totalDays = attendanceRecords?.length || 0
  const presentDays = attendanceRecords?.filter((a) => a.status === "present").length || 0
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  // Get recent marks
  const { data: recentMarks } = await supabase
    .from("marks")
    .select("*")
    .eq("student_id", selectedChild.id)
    .order("exam_date", { ascending: false })
    .limit(5)

  const averagePercentage =
    recentMarks && recentMarks.length > 0
      ? Math.round(
          recentMarks.reduce((sum, m) => sum + (Number(m.marks_obtained) / Number(m.total_marks)) * 100, 0) /
            recentMarks.length,
        )
      : 0

  // Get fee status - Enhanced to get pending amount for alert
  const { data: feeRecords } = await supabase.from("fee_payments").select("*").eq("student_id", selectedChild.id)

  const pendingFees = feeRecords?.filter((f) => f.status === "pending" || f.status === "overdue") || []
  const totalDue = pendingFees.reduce((sum, f) => sum + Number(f.amount), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Parent Portal</h1>
                <p className="text-sm text-gray-600">Welcome, {parent.full_name}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PendingPaymentAlert pendingAmount={totalDue} pendingCount={pendingFees.length} />

        {/* Child Selector */}
        {children.length > 1 && <ParentChildSelector children={children} selectedId={selectedChildId} />}

        {/* Child Profile Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedChild.photo_url || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {selectedChild.full_name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{selectedChild.full_name}</h2>
                <div className="mt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge variant="secondary">Student ID: {selectedChild.student_id}</Badge>
                  <Badge variant="secondary">
                    Class {selectedChild.class}
                    {selectedChild.section && ` - ${selectedChild.section}`}
                  </Badge>
                  <Badge variant="secondary">Roll No: {selectedChild.roll_number}</Badge>
                </div>
                {selectedChild.date_of_birth && (
                  <p className="mt-2 text-sm text-gray-600">
                    Date of Birth: {new Date(selectedChild.date_of_birth).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
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
              <CardTitle className="text-sm font-medium">Academic Average</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averagePercentage}%</div>
              <p className="text-xs text-muted-foreground">Based on {recentMarks?.length || 0} recent exams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalDue === 0 ? (
                  <span className="text-green-600">₹0</span>
                ) : (
                  <span className="text-red-600">₹{totalDue.toLocaleString()}</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalDue === 0 ? "All fees cleared" : "Payment required"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="performance">
              <GraduationCap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="fees">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Fees</span>
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Announcements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <ParentChildAttendance studentId={selectedChild.id} />
          </TabsContent>

          <TabsContent value="performance">
            <ParentChildMarks studentId={selectedChild.id} />
          </TabsContent>

          <TabsContent value="fees">
            <ParentChildFees studentId={selectedChild.id} />
          </TabsContent>

          <TabsContent value="announcements">
            <ParentAnnouncements />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
