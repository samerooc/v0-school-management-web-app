import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We have sent you a verification link to confirm your email address</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to complete your registration.
            </p>
            <p className="text-sm text-muted-foreground">If you do not see the email, check your spam folder.</p>
            <Link href="/auth/login" className="inline-block text-sm text-blue-600 hover:underline">
              Return to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
