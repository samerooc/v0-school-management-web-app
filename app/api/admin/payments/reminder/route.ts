import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { student_id } = await request.json()

  // Get pending payments for this student
  const { data: pendingPayments } = await supabase
    .from("fee_payments")
    .select("*")
    .eq("student_id", student_id)
    .in("status", ["pending", "overdue"])

  // Create payment reminders
  if (pendingPayments && pendingPayments.length > 0) {
    for (const payment of pendingPayments) {
      await supabase.from("payment_reminders").insert({
        student_id,
        fee_payment_id: payment.id,
        reminder_date: new Date().toISOString().split("T")[0],
        reminder_type: payment.status === "overdue" ? "overdue" : "pending",
        message: `Payment reminder for ${payment.fee_type}: ₹${payment.amount} due on ${payment.due_date}`,
        is_sent: true,
      })
    }
  }

  return NextResponse.json({ success: true })
}
