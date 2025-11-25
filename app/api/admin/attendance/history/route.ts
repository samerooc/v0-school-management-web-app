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
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    const { data: records } = await supabase
      .from("attendance")
      .select(
        `
        *,
        students (
          student_id,
          full_name,
          class,
          roll_number
        )
      `,
      )
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false })

    return NextResponse.json({ records: records || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch attendance history" }, { status: 500 })
  }
}
