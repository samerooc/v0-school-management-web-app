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

  const { sections } = await request.json()

  for (const section of sections) {
    const { error } = await supabase
      .from("homepage_sections")
      .update({
        section_title: section.section_title,
        section_subtitle: section.section_subtitle,
        is_visible: section.is_visible,
        display_order: section.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
