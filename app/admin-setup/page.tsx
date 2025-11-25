"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"

export default function AdminSetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const createAdmin = async () => {
    setStatus("loading")
    setMessage("Admin account create ho raha hai...")

    try {
      // Sign up the admin user
      const { data, error } = await supabase.auth.signUp({
        email: "ankitkumar02say@gmail.com",
        password: "123456",
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
          data: {
            role: "admin",
            full_name: "Admin User",
          },
        },
      })

      if (error) {
        // Check if user already exists
        if (error.message.includes("already registered")) {
          setStatus("error")
          setMessage("Admin user already exists! Please login with ankitkumar02say@gmail.com")
          return
        }
        throw error
      }

      if (data.user) {
        // Update profile to admin role
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          email: "ankitkumar02say@gmail.com",
          role: "admin",
          full_name: "Admin User",
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Profile error:", profileError)
        }

        setStatus("success")
        setMessage("Admin account create ho gaya! Ab aap login kar sakte hain: ankitkumar02say@gmail.com / 123456")
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Kuch error aa gaya")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>Yeh page sirf ek baar use hoga admin account create karne ke liye</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p>
              <strong>Email:</strong> ankitkumar02say@gmail.com
            </p>
            <p>
              <strong>Password:</strong> 123456
            </p>
          </div>

          {status === "idle" && (
            <Button onClick={createAdmin} className="w-full">
              Create Admin Account
            </Button>
          )}

          {status === "loading" && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </Button>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <p>{message}</p>
              </div>
              <Button asChild className="w-full">
                <a href="/auth/login">Go to Login</a>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <p>{message}</p>
              </div>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <a href="/auth/login">Go to Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
