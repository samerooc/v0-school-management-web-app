import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, Award } from "lucide-react"

interface ParentChildMarksProps {
  studentId: string
}

export default async function ParentChildMarks({ studentId }: ParentChildMarksProps) {
  const supabase = await createClient()

  const { data: marks } = await supabase
    .from("marks")
    .select("*")
    .eq("student_id", studentId)
    .order("exam_date", { ascending: false })

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800"
    if (percentage >= 75) return "bg-blue-100 text-blue-800"
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Calculate subject-wise performance
  const subjectPerformance =
    marks?.reduce(
      (acc, mark) => {
        if (!acc[mark.subject]) {
          acc[mark.subject] = { total: 0, count: 0 }
        }
        const percentage = (Number(mark.marks_obtained) / Number(mark.total_marks)) * 100
        acc[mark.subject].total += percentage
        acc[mark.subject].count += 1
        return acc
      },
      {} as Record<string, { total: number; count: number }>,
    ) || {}

  const subjectAverages = Object.entries(subjectPerformance).map(([subject, data]) => ({
    subject,
    average: Math.round(data.total / data.count),
  }))

  const overallAverage =
    marks && marks.length > 0
      ? Math.round(
          marks.reduce((sum, m) => sum + (Number(m.marks_obtained) / Number(m.total_marks)) * 100, 0) / marks.length,
        )
      : 0

  return (
    <div className="space-y-4">
      {/* Performance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{overallAverage}%</div>
            <p className="text-sm text-gray-600 mt-1">Average across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {subjectAverages.slice(0, 3).map((item) => (
                <div key={item.subject} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.subject}</span>
                  <Badge className={getGradeColor(item.average)} variant="secondary">
                    {item.average}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Marks */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          {marks && marks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((mark) => {
                    const percentage = Math.round((Number(mark.marks_obtained) / Number(mark.total_marks)) * 100)
                    return (
                      <TableRow key={mark.id}>
                        <TableCell className="font-medium">{mark.subject}</TableCell>
                        <TableCell>{mark.exam_name}</TableCell>
                        <TableCell>{mark.exam_date ? format(new Date(mark.exam_date), "MMM d, yyyy") : "-"}</TableCell>
                        <TableCell className="text-right">
                          {mark.marks_obtained}/{mark.total_marks}
                        </TableCell>
                        <TableCell className="text-right">{percentage}%</TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(percentage)} variant="secondary">
                            {mark.grade || "-"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No exam results recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
