"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, UserPlus } from "lucide-react"
import StudentForm from "./student-form"

interface Student {
  id: string
  student_id: string
  full_name: string
  class: string
  section: string | null
  roll_number: string
  date_of_birth: string | null
  gender: string | null
  phone: string | null
  photo_url: string | null
}

interface StudentListProps {
  students: Student[]
  classes: string[]
  currentSearch?: string
  currentClass?: string
}

export default function StudentList({ students, classes, currentSearch, currentClass }: StudentListProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchValue, setSearchValue] = useState(currentSearch || "")
  const [classFilter, setClassFilter] = useState(currentClass || "all")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchValue) params.set("search", searchValue)
    if (classFilter !== "all") params.set("class", classFilter)
    router.push(`/admin/students?${params.toString()}`)
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return

    try {
      const response = await fetch(`/api/admin/students/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete student")

      router.refresh()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEditingStudent(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Student Records</CardTitle>
            <Dialog open={isOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Register Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingStudent ? "Edit Student" : "Register New Student"}</DialogTitle>
                </DialogHeader>
                <StudentForm
                  student={editingStudent}
                  onSuccess={() => {
                    setIsOpen(false)
                    setEditingStudent(null)
                    router.refresh()
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </div>

          {/* Student Table */}
          {students.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.photo_url || undefined} />
                            <AvatarFallback>
                              {student.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.full_name}</p>
                            {student.gender && <p className="text-sm text-gray-600">{student.gender}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.student_id}</Badge>
                      </TableCell>
                      <TableCell>
                        Class {student.class}
                        {student.section && ` - ${student.section}`}
                      </TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>{student.phone || <span className="text-gray-400">N/A</span>}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No students found</p>
              <p className="text-sm text-gray-400">
                {currentSearch || currentClass
                  ? "Try adjusting your filters"
                  : "Register your first student to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
