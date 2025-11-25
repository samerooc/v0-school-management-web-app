import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: Refresh the user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const publicRoutes = ["/", "/auth/login", "/auth/sign-up"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  const isAuthCallback = request.nextUrl.pathname.startsWith("/auth/callback")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/")

  if (!user && !isPublicRoute && !isAuthCallback && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users from auth pages to their dashboard
  if (user && (request.nextUrl.pathname === "/auth/login" || request.nextUrl.pathname === "/auth/sign-up")) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    const url = request.nextUrl.clone()
    if (profile?.role === "admin") {
      url.pathname = "/admin"
    } else if (profile?.role === "parent") {
      url.pathname = "/parent"
    } else if (profile?.role === "student") {
      url.pathname = "/student"
    } else {
      url.pathname = "/"
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
