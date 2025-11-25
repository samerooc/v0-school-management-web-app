import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PaymentManagement from "@/components/admin/payment-management"

export default async function PaymentsPage() {
  await requireRole(["admin"])
  const supabase = await createClient()

  // Get all students with their fee payments
  const { data: students } = await supabase.from("students").select("*, fee_payments(*)").order("full_name")

  // Get payment summary
  const { data: allPayments } = await supabase.from("fee_payments").select("*")

  const totalPending =
    allPayments
      ?.filter((p) => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0

  const totalPaid = allPayments?.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0) || 0

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
              <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-sm text-gray-600">Manage student fees and send payment reminders</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PaymentManagement students={students || []} totalPending={totalPending} totalPaid={totalPaid} />
      </main>
    </div>
  )
}
