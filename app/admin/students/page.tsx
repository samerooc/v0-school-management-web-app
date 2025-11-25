import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import StudentList from "@/components/admin/student-list"

export default async function StudentsManagementPage({
  searchParams,
}: {
  searchParams: { search?: string; class?: string }
}) {
  await requireRole(["admin"])
  const supabase = await createClient()

  let query = supabase.from("students").select("*").order("full_name", { ascending: true })

  if (searchParams.search) {
    query = query.or(`full_name.ilike.%${searchParams.search}%,student_id.ilike.%${searchParams.search}%`)
  }

  if (searchParams.class) {
    query = query.eq("class", searchParams.class)
  }

  const { data: students } = await query

  // Get unique classes for filter
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
              <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
              <p className="text-sm text-gray-600">Register and manage student records</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StudentList
          students={students || []}
          classes={uniqueClasses}
          currentSearch={searchParams.search}
          currentClass={searchParams.class}
        />
      </main>
    </div>
  )
}
