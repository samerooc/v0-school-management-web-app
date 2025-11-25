import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, BarChart } from "lucide-react"
import Link from "next/link"
import AttendanceMarking from "@/components/admin/attendance-marking"
import AttendanceHistory from "@/components/admin/attendance-history"

export default async function AttendancePage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  // Get unique classes for attendance marking
  const { data: classData } = await supabase.from("students").select("class").order("class")

  const uniqueClasses = [...new Set(classData?.map((s) => s.class) || [])].sort()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
              <p className="text-sm text-gray-600">Mark and manage student attendance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="mark" className="space-y-4">
          <TabsList>
            <TabsTrigger value="mark">
              <Calendar className="h-4 w-4 mr-2" />
              Mark Attendance
            </TabsTrigger>
            <TabsTrigger value="history">
              <BarChart className="h-4 w-4 mr-2" />
              Attendance History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mark">
            <AttendanceMarking classes={uniqueClasses} />
          </TabsContent>

          <TabsContent value="history">
            <AttendanceHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
