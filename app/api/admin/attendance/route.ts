import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
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

    const { records } = await request.json()

    // Upsert attendance records
    const attendanceData = records.map((record: any) => ({
      student_id: record.student_id,
      date: record.date,
      status: record.status,
      notes: record.notes || null,
      marked_by: user.id,
    }))

    const { error } = await supabase.from("attendance").upsert(attendanceData, {
      onConflict: "student_id,date",
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save attendance" }, { status: 500 })
  }
}
