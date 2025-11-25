"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { format } from "date-fns"

interface AttendanceMarkingProps {
  classes: string[]
}

interface Student {
  id: string
  student_id: string
  full_name: string
  roll_number: string
  photo_url: string | null
}

export default function AttendanceMarking({ classes }: AttendanceMarkingProps) {
  const router = useRouter()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, { status: string; notes: string }>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass, selectedDate])

  const loadStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/attendance/students?class=${selectedClass}&date=${selectedDate}`)
      const data = await response.json()

      setStudents(data.students || [])

      // Initialize attendance state with existing records or defaults
      const initialAttendance: Record<string, { status: string; notes: string }> = {}
      data.students.forEach((student: Student) => {
        const existing = data.existingAttendance?.find((a: any) => a.student_id === student.id)
        initialAttendance[student.id] = {
          status: existing?.status || "present",
          notes: existing?.notes || "",
        }
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }))
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }))
  }

  const handleMarkAll = (status: string) => {
    const updated: Record<string, { status: string; notes: string }> = {}
    students.forEach((student) => {
      updated[student.id] = {
        status,
        notes: attendance[student.id]?.notes || "",
      }
    })
    setAttendance(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccess(false)

    try {
      const records = students.map((student) => ({
        student_id: student.id,
        date: selectedDate,
        status: attendance[student.id]?.status || "present",
        notes: attendance[student.id]?.notes || "",
      }))

      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save attendance")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark Daily Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Class Selection */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      Class {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Actions */}
          {students.length > 0 && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleMarkAll("present")}>
                Mark All Present
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleMarkAll("absent")}>
                Mark All Absent
              </Button>
            </div>
          )}

          {/* Student List */}
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-sm text-gray-600 mt-2">Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar>
                    <AvatarImage src={student.photo_url || undefined} />
                    <AvatarFallback>
                      {student.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-medium">{student.full_name}</p>
                    <p className="text-sm text-gray-600">
                      Roll: {student.roll_number} | ID: {student.student_id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {["present", "absent", "late", "excused"].map((status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={attendance[student.id]?.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(student.id, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedClass ? "No students found in this class" : "Please select a class to mark attendance"}
            </div>
          )}

          {/* Submit Button */}
          {students.length > 0 && (
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Attendance
                  </>
                )}
              </Button>
              {success && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Attendance saved successfully!</span>
                </div>
              )}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
