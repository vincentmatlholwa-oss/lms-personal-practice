"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { mockAssignments, mockSubmissions, mockCourses, mockEnrollments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronRight, Clock, Download, Upload, FileText, CheckCircle, MessageSquare } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function AssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const { user, users } = useAuth()
  const courseId = Number(params.courseId)
  const moduleId = Number(params.moduleId)
  const assignmentId = Number(params.assignmentId)

  const assignment = mockAssignments.find((a) => a.id === assignmentId)
  if (!assignment) return <div className="p-6"><h1>Assignment not found</h1></div>
  if (!user) return null

  const course = mockCourses.find((c) => c.id === courseId)
  const isFacilitator = course?.facilitatorId === user.id || user.role === "Admin"

  if (isFacilitator) {
    return <FacilitatorGradingView assignment={assignment} courseId={courseId} moduleId={moduleId} users={users} router={router} />
  }

  return <StudentAssignmentView assignment={assignment} courseId={courseId} moduleId={moduleId} userId={user.id} router={router} />
}

function FacilitatorGradingView({ assignment, courseId, moduleId, users, router }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignment: any; courseId: number; moduleId: number; users: any[]; router: any
}) {
  const [submissions, setSubmissions] = useState(() =>
    mockSubmissions.filter((s) => s.activityId === assignment.id && s.activityType === "assignment")
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gradingSub, setGradingSub] = useState<any>(null)
  const [marks, setMarks] = useState("")
  const [feedback, setFeedback] = useState("")

  const enrolledStudents = mockEnrollments.filter((e) => e.courseId === courseId)
  const notSubmitted = enrolledStudents.filter((e) => !submissions.some((s) => s.userId === e.userId))

  const handleGrade = () => {
    if (!marks || isNaN(Number(marks))) {
      toast.error("Please enter valid marks")
      return
    }
    const sub = mockSubmissions.find((s) => s.id === gradingSub.id)
    if (sub) {
      sub.marks = Number(marks)
      sub.totalMarks = 100
      sub.graded = true
      sub.feedback = feedback
      sub.gradedAt = new Date().toISOString()
      sub.gradedBy = users.find((u) => u.role === "Facilitator" || u.role === "Admin")?.id || 0
    }
    setSubmissions(mockSubmissions.filter((s) => s.activityId === assignment.id && s.activityType === "assignment"))
    setGradingSub(null)
    setMarks("")
    setFeedback("")
    toast.success("Assignment graded successfully!")
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 animate-slide-up">
        <button onClick={() => router.push(`/courses`)} className="hover:text-gold">Courses</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => router.push(`/courses/${courseId}`)} className="hover:text-gold">Course</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)} className="hover:text-gold">Module</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{assignment.title} - Grading</span>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "40ms" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>{assignment.title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Grade student submissions</p>
        </div>
      </div>

      {submissions.length === 0 && notSubmitted.length > 0 && (
        <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "60ms" }}>
          <CardHeader><CardTitle>No Submissions Yet</CardTitle></CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">{notSubmitted.length} student(s) have not submitted yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
        {submissions.length === 0 && notSubmitted.length === 0 && (
          <Card className="border-0 shadow-card">
            <CardContent className="text-center py-12 text-muted-foreground">
              {enrolledStudents.length === 0 ? "No students enrolled in this course." : "No submissions yet."}
            </CardContent>
          </Card>
        )}
        {submissions.map((sub) => {
          const student = users.find((u) => u.id === sub.userId)
          return (
            <Card key={sub.id} className="border-0 shadow-card card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-gold text-black flex items-center justify-center text-sm font-medium">
                      {student ? `${student.firstName[0]}${student.lastName[0]}` : "U"}
                    </div>
                    <div>
                      <CardTitle className="text-base">{student ? `${student.firstName} ${student.lastName}` : `User #${sub.userId}`}</CardTitle>
                      <CardDescription>Submitted {new Date(sub.submittedAt).toLocaleString()}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.graded ? (
                      <span className="text-sm font-medium text-success">{sub.marks}/{sub.totalMarks}</span>
                    ) : (
                      <span className="text-xs text-warning font-medium">Pending</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Student Submission</p>
                  <p className="text-sm whitespace-pre-wrap">{sub.content}</p>
                </div>
                {sub.graded && sub.feedback && (
                  <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Your Feedback</p>
                    <p className="text-sm">{sub.feedback}</p>
                  </div>
                )}
                {!sub.graded && (
                  <Button onClick={() => { setGradingSub(sub); setMarks(""); setFeedback("") }}>
                    Grade Submission
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={!!gradingSub} onOpenChange={(o) => { if (!o) setGradingSub(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              {gradingSub && users.find((u) => u.id === gradingSub.userId)?.firstName}&apos;s submission for {assignment.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {gradingSub && (
              <div className="p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1">Submission:</p>
                <p className="text-sm whitespace-pre-wrap">{gradingSub.content}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="marks">Marks (out of 100)</Label>
              <Input id="marks" type="number" min="0" max="100" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="Enter marks" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback to the student..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradingSub(null)}>Cancel</Button>
            <Button onClick={handleGrade}>Submit Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StudentAssignmentView({ assignment, courseId, moduleId, userId, router }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignment: any; courseId: number; moduleId: number; userId: number; router: any
}) {
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const existingSub = mockSubmissions.find((s) => s.userId === userId && s.activityId === assignment.id && s.activityType === "assignment")
  const canResubmit = existingSub?.resubmissionAllowed
  const initialSubmitted = !!existingSub && !canResubmit
  const [submitted, setSubmitted] = useState(initialSubmitted)

  const isOverdue = new Date(assignment.dueDate) < new Date()

  const handleSubmit = () => {
    if (!content.trim() && !file) {
      toast.error("Please provide your submission content or file")
      return
    }
    const subIdx = mockSubmissions.findIndex(
      (s) => s.userId === userId && s.activityId === assignment.id && s.activityType === "assignment"
    )
    const hasExisting = subIdx >= 0
    if (hasExisting && mockSubmissions[subIdx].resubmissionAllowed) {
      mockSubmissions[subIdx] = {
        ...mockSubmissions[subIdx],
        content: content || (file ? file.name : ""),
        submittedAt: new Date().toISOString(),
        graded: false,
        feedback: undefined,
        marks: undefined,
      }
      toast.success("Assignment resubmitted successfully!")
      return
    }
    if (!hasExisting) {
      mockSubmissions.push({
        id: mockSubmissions.length + 1,
        userId,
        activityId: assignment.id,
        activityType: "assignment",
        content: content || (file ? file.name : ""),
        submittedAt: new Date().toISOString(),
        graded: false,
      })
    }
    setSubmitted(true)
    toast.success("Assignment submitted successfully!")
  }

  const handleUnsubmit = () => {
    setSubmitted(false)
    toast.success("Submission reopened. You can resubmit.")
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 animate-slide-up">
        <button onClick={() => router.push(`/courses`)} className="hover:text-gold">Courses</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => router.push(`/courses/${courseId}`)} className="hover:text-gold">Course</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)} className="hover:text-gold">Module</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{assignment.title}</span>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "40ms" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <FileText className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>{assignment.title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{assignment.description}</p>
        </div>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{assignment.title}</CardTitle>
              <CardDescription>{assignment.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span className={isOverdue ? "text-destructive font-medium" : ""}>
                {isOverdue ? "Overdue" : `Due: ${assignment.dueDate}`}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {assignment.attachments.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium">Attachments</p>
              {assignment.attachments.map((att: { name: string; url: string }, i: number) => (
                <a key={i} href={att.url} className="flex items-center gap-2 text-sm text-gold hover:underline">
                  <Download className="w-4 h-4" /> {att.name}
                </a>
              ))}
            </div>
          )}

          {existingSub?.graded && (
            <div className="mb-6 p-4 bg-success/5 border border-success/20 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Grade</span>
                <span className="text-lg font-bold text-success">{existingSub.marks}/{existingSub.totalMarks}</span>
              </div>
              {existingSub.feedback && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Feedback</p>
                  <p className="text-sm">{existingSub.feedback}</p>
                </div>
              )}
            </div>
          )}

          {submitted && existingSub?.graded && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-success" />
              </div>
              <h3>Assignment Graded</h3>
              <p className="text-xs text-muted-foreground">Submitted at: {new Date(existingSub.submittedAt).toLocaleString()}</p>
              <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}>
                Back to Module
              </Button>
            </div>
          )}

          {submitted && !existingSub?.graded && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-success" />
              </div>
              <h3>Assignment Submitted</h3>
              <p className="text-xs text-muted-foreground">Submitted at: {existingSub ? new Date(existingSub.submittedAt).toLocaleString() : "Just now"}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}>
                  Back to Module
                </Button>
                {!existingSub?.graded && (
                  <Button variant="outline" onClick={handleUnsubmit} className="text-destructive border-destructive">
                    Unsubmit
                  </Button>
                )}
              </div>
            </div>
          )}

          {!submitted && (
            isOverdue ? (
              <div className="text-center py-8 space-y-4">
                <Clock className="w-12 h-12 text-destructive mx-auto" />
                <h3 className="text-destructive">Submission Closed</h3>
                <p className="text-sm text-muted-foreground">The due date has passed. You can no longer submit this assignment.</p>
                <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}>
                  Back to Module
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Your Submission</Label>
                  <Textarea
                    id="content"
                    placeholder="Type your answer here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File (optional)</Label>
                  <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  {assignment.timeLimit && (
                    <p className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Time limit: {assignment.timeLimit} minutes
                    </p>
                  )}
                  <Button onClick={handleSubmit}>
                    <Upload className="w-4 h-4 mr-2" /> Submit Assignment
                  </Button>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}