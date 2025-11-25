import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import StudentParentRegistration from "@/components/admin/student-parent-registration"

export default async function RegisterPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  // Get existing students for parent linking
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name, student_id, class")
    .order("full_name")

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
              <h1 className="text-2xl font-bold text-gray-900">Register Student/Parent</h1>
              <p className="text-sm text-gray-600">Manually create accounts with login credentials</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <StudentParentRegistration students={students || []} />
      </main>
    </div>
  )
}
