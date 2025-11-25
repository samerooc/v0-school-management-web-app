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

    const body = await request.json()

    // Check if student_id already exists
    const { data: existing } = await supabase.from("students").select("id").eq("student_id", body.student_id).single()

    if (existing) {
      return NextResponse.json({ error: "Student ID already exists" }, { status: 400 })
    }

    const { error } = await supabase.from("students").insert({
      student_id: body.student_id,
      full_name: body.full_name,
      class: body.class,
      section: body.section || null,
      roll_number: body.roll_number,
      date_of_birth: body.date_of_birth || null,
      gender: body.gender || null,
      blood_group: body.blood_group || null,
      address: body.address || null,
      phone: body.phone || null,
      admission_date: body.admission_date || null,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create student" }, { status: 500 })
  }
}
