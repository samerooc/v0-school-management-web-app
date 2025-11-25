import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface StudentMarksProps {
  studentId: string
}

export default async function StudentMarks({ studentId }: StudentMarksProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
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
          <p className="text-center text-gray-500 py-8">No marks recorded yet</p>
        )}
      </CardContent>
    </Card>
  )
}
