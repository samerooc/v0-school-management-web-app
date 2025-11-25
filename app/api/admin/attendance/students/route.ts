import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const className = searchParams.get("class")
    const date = searchParams.get("date")

    if (!className || !date) {
      return NextResponse.json({ error: "Class and date are required" }, { status: 400 })
    }

    // Get students in the class
    const { data: students } = await supabase
      .from("students")
      .select("id, student_id, full_name, roll_number, photo_url")
      .eq("class", className)
      .order("roll_number")

    // Get existing attendance for this date
    const { data: existingAttendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("date", date)
      .in("student_id", students?.map((s) => s.id) || [])

    return NextResponse.json({
      students: students || [],
      existingAttendance: existingAttendance || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch students" }, { status: 500 })
  }
}
