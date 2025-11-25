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

  const body = await request.json()
  const { email, password, full_name, phone, relation, linked_student_id } = body

  // Create auth user using admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email,
    role: "parent",
    full_name,
  })

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // Create parent record
  const { data: parent, error: parentError } = await supabase
    .from("parents")
    .insert({
      user_id: authData.user.id,
      full_name,
      phone,
      relation,
    })
    .select()
    .single()

  if (parentError) {
    return NextResponse.json({ error: parentError.message }, { status: 500 })
  }

  // Link parent to student if provided
  if (linked_student_id) {
    await supabase.from("student_parents").insert({
      student_id: linked_student_id,
      parent_id: parent.id,
      relation,
    })
  }

  return NextResponse.json({ success: true, parent })
}
