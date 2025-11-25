"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, UserPlus, GraduationCap, Users, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  full_name: string
  student_id: string
  class: string
}

interface StudentParentRegistrationProps {
  students: Student[]
}

export default function StudentParentRegistration({ students }: StudentParentRegistrationProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Student form
  const [studentForm, setStudentForm] = useState({
    email: "",
    password: "",
    full_name: "",
    student_id: "",
    class: "",
    section: "",
    roll_number: "",
    date_of_birth: "",
    gender: "male",
    guardian_name: "",
    guardian_phone: "",
    address: "",
  })

  // Parent form
  const [parentForm, setParentForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    relation: "father",
    linked_student_id: "",
  })

  const handleStudentRegister = async () => {
    if (!studentForm.email || !studentForm.password || !studentForm.full_name || !studentForm.student_id) {
      setError("Please fill all required fields")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/register/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register student")
      }

      setSuccess(`Student "${studentForm.full_name}" registered successfully!`)
      setStudentForm({
        email: "",
        password: "",
        full_name: "",
        student_id: "",
        class: "",
        section: "",
        roll_number: "",
        date_of_birth: "",
        gender: "male",
        guardian_name: "",
        guardian_phone: "",
        address: "",
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleParentRegister = async () => {
    if (!parentForm.email || !parentForm.password || !parentForm.full_name) {
      setError("Please fill all required fields")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/admin/register/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parentForm),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register parent")
      }

      setSuccess(`Parent "${parentForm.full_name}" registered successfully!`)
      setParentForm({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        relation: "father",
        linked_student_id: "",
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="student" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="student" className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Register Student
        </TabsTrigger>
        <TabsTrigger value="parent" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Register Parent
        </TabsTrigger>
      </TabsList>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      <TabsContent value="student">
        <Card>
          <CardHeader>
            <CardTitle>Register New Student</CardTitle>
            <CardDescription>Create a student account with login credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Credentials */}
            <div className="p-4 bg-blue-50 rounded-lg space-y-4">
              <h4 className="font-medium text-blue-900">Login Credentials</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-4">
              <h4 className="font-medium">Student Details</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={studentForm.full_name}
                    onChange={(e) => setStudentForm({ ...studentForm, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Student ID *</Label>
                  <Input
                    value={studentForm.student_id}
                    onChange={(e) => setStudentForm({ ...studentForm, student_id: e.target.value })}
                    placeholder="e.g., STU001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select
                    value={studentForm.class}
                    onValueChange={(value) => setStudentForm({ ...studentForm, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((c) => (
                        <SelectItem key={c} value={c}>
                          Class {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select
                    value={studentForm.section}
                    onValueChange={(value) => setStudentForm({ ...studentForm, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Roll Number</Label>
                  <Input
                    value={studentForm.roll_number}
                    onChange={(e) => setStudentForm({ ...studentForm, roll_number: e.target.value })}
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={studentForm.date_of_birth}
                    onChange={(e) => setStudentForm({ ...studentForm, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={studentForm.gender}
                    onValueChange={(value) => setStudentForm({ ...studentForm, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <Input
                    value={studentForm.guardian_name}
                    onChange={(e) => setStudentForm({ ...studentForm, guardian_name: e.target.value })}
                    placeholder="Parent/Guardian name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Guardian Phone</Label>
                  <Input
                    value={studentForm.guardian_phone}
                    onChange={(e) => setStudentForm({ ...studentForm, guardian_phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={studentForm.address}
                    onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleStudentRegister} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Register Student
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="parent">
        <Card>
          <CardHeader>
            <CardTitle>Register New Parent</CardTitle>
            <CardDescription>Create a parent account and link to student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Login Credentials */}
            <div className="p-4 bg-green-50 rounded-lg space-y-4">
              <h4 className="font-medium text-green-900">Login Credentials</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={parentForm.email}
                    onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                    placeholder="parent@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input
                    type="password"
                    value={parentForm.password}
                    onChange={(e) => setParentForm({ ...parentForm, password: e.target.value })}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
            </div>

            {/* Parent Details */}
            <div className="space-y-4">
              <h4 className="font-medium">Parent Details</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={parentForm.full_name}
                    onChange={(e) => setParentForm({ ...parentForm, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={parentForm.phone}
                    onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Relation to Student</Label>
                  <Select
                    value={parentForm.relation}
                    onValueChange={(value) => setParentForm({ ...parentForm, relation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Link to Student</Label>
                  <Select
                    value={parentForm.linked_student_id}
                    onValueChange={(value) => setParentForm({ ...parentForm, linked_student_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No student linked</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} ({student.student_id}) - Class {student.class}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={handleParentRegister} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Register Parent
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
