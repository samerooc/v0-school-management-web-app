"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Search, CreditCard, AlertTriangle, CheckCircle, Clock, Send, IndianRupee } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

interface Student {
  id: string
  full_name: string
  student_id: string
  class: string
  section: string
  fee_payments: FeePayment[]
}

interface FeePayment {
  id: string
  student_id: string
  fee_type: string
  amount: number
  due_date: string
  payment_date: string | null
  status: string
  transaction_id: string | null
}

interface PaymentManagementProps {
  students: Student[]
  totalPending: number
  totalPaid: number
}

export default function PaymentManagement({ students, totalPending, totalPaid }: PaymentManagementProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [newPayment, setNewPayment] = useState({
    fee_type: "tuition",
    amount: "",
    due_date: "",
    status: "pending",
  })

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch

    const hasStatus = student.fee_payments.some((p) =>
      filterStatus === "pending" ? p.status === "pending" || p.status === "overdue" : p.status === filterStatus,
    )
    return matchesSearch && hasStatus
  })

  const handleAddPayment = async () => {
    if (!selectedStudent || !newPayment.amount || !newPayment.due_date) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: selectedStudent,
          ...newPayment,
          amount: Number.parseFloat(newPayment.amount),
        }),
      })

      if (response.ok) {
        router.refresh()
        setNewPayment({ fee_type: "tuition", amount: "", due_date: "", status: "pending" })
        setSelectedStudent("")
      }
    } catch (error) {
      console.error("Add payment error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", payment_date: new Date().toISOString() }),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Update payment error:", error)
    }
  }

  const handleSendReminder = async (studentId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/payments/reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId }),
      })

      if (response.ok) {
        alert("Payment reminder sent successfully!")
      }
    } catch (error) {
      console.error("Send reminder error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 flex items-center">
              <IndianRupee className="h-5 w-5" />
              {totalPending.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <IndianRupee className="h-5 w-5" />
              {totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students with Dues</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                students.filter((s) => s.fee_payments.some((p) => p.status === "pending" || p.status === "overdue"))
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage Payments</TabsTrigger>
          <TabsTrigger value="add">Add Fee</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Student Payments</CardTitle>
              <CardDescription>View and manage student fee payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending/Overdue</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Student List */}
              <div className="space-y-4">
                {filteredStudents.map((student) => {
                  const pendingPayments = student.fee_payments.filter(
                    (p) => p.status === "pending" || p.status === "overdue",
                  )
                  const totalDue = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0)

                  return (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{student.full_name}</h4>
                          <p className="text-sm text-gray-500">
                            {student.student_id} | Class {student.class}-{student.section}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {totalDue > 0 && (
                            <>
                              <span className="text-red-600 font-medium flex items-center">
                                <IndianRupee className="h-4 w-4" />
                                {totalDue.toLocaleString()} due
                              </span>
                              <Button size="sm" variant="outline" onClick={() => handleSendReminder(student.id)}>
                                <Send className="h-4 w-4 mr-1" />
                                Send Reminder
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {student.fee_payments.length > 0 ? (
                        <div className="space-y-2">
                          {student.fee_payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-4">
                                <span className="font-medium capitalize">{payment.fee_type}</span>
                                <span className="flex items-center">
                                  <IndianRupee className="h-3 w-3" />
                                  {Number(payment.amount).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Due: {format(new Date(payment.due_date), "MMM dd, yyyy")}
                                </span>
                                {getStatusBadge(payment.status)}
                              </div>
                              {payment.status !== "paid" && (
                                <Button size="sm" onClick={() => handleMarkAsPaid(payment.id)}>
                                  Mark as Paid
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No payment records</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Fee</CardTitle>
              <CardDescription>Create a new fee payment record for a student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Select Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} ({student.student_id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fee Type</Label>
                  <Select
                    value={newPayment.fee_type}
                    onValueChange={(value) => setNewPayment({ ...newPayment, fee_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition Fee</SelectItem>
                      <SelectItem value="admission">Admission Fee</SelectItem>
                      <SelectItem value="exam">Exam Fee</SelectItem>
                      <SelectItem value="transport">Transport Fee</SelectItem>
                      <SelectItem value="library">Library Fee</SelectItem>
                      <SelectItem value="lab">Lab Fee</SelectItem>
                      <SelectItem value="sports">Sports Fee</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newPayment.due_date}
                    onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleAddPayment}
                disabled={isLoading || !selectedStudent || !newPayment.amount || !newPayment.due_date}
              >
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Fee
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
