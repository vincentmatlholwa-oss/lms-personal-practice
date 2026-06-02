"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../../lib/auth-context"
import { useData } from "../../../../lib/data-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Textarea } from "../../../../components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import {
  FileText, Clock, ChevronRight, ClipboardList, BookOpen, Plus, UserCheck, HelpCircle,
  MessageSquare, Star, ArrowUp, ArrowDown,
} from "lucide-react"
import { toast } from "sonner"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NewDiscussionForm({ courseId, user, discussions, setDiscussions }: { courseId: number; user: any; discussions: any[]; setDiscussions: (d: any[]) => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [open, setOpen] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    const newDisc = {
      id: discussions.length + 1,
      courseId,
      userId: user.id,
      title,
      content,
      createdAt: new Date().toISOString(),
      pinned: false,
      resolved: false,
    }
    setDiscussions([...discussions, newDisc])
    setTitle("")
    setContent("")
    setOpen(false)
    toast.success("Discussion started!")
  }

  if (!open) return null
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="disc-title">Title</Label>
        <Input id="disc-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's on your mind?" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disc-content">Content</Label>
        <Textarea id="disc-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your question or topic..." rows={4} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit">Post Discussion</Button>
      </div>
    </form>
  )
}

function NewReviewForm({ courseId, userId, courseReviews, setCourseReviews }: { courseId: number; userId: number; courseReviews: any[]; setCourseReviews: (r: any[]) => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [open, setOpen] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error("Please write a comment")
      return
    }
    const newReview = {
      id: courseReviews.length + 1,
      userId,
      courseId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    }
    setCourseReviews([...courseReviews, newReview])
    setOpen(false)
    toast.success("Review submitted!")
  }

  if (!open) return null
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
              <Star className={`w-6 h-6 ${star <= rating ? "text-gold fill-gold" : "text-muted-foreground"}`} />
            </button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-comment">Comment</Label>
        <Textarea id="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." rows={4} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button type="submit">Submit Review</Button>
      </div>
    </form>
  )
}

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const { user, users } = useAuth()
  const { courses, setCourses, enrollments, setEnrollments, modules, setModules, quizzes, setQuizzes, assignments, setAssignments, lessons, gradebook, discussions, setDiscussions, discussionReplies, courseReviews, setCourseReviews, loading } = useData()
  const courseId = Number(params.courseId)
  const course = courses.find((c) => c.id === courseId)

  const [moduleDialogOpen, setModuleDialogOpen] = useState(false)
  const [newModule, setNewModule] = useState({ title: "", description: "" })
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false)
  const [newAssessment, setNewAssessment] = useState({ type: "Quiz", title: "", description: "", dueDate: "" })
  const [facilitatorDialogOpen, setFacilitatorDialogOpen] = useState(false)
  const [selectedFacilitatorId, setSelectedFacilitatorId] = useState<string>(course?.facilitatorId?.toString() || "")

  if (!user) return null
  if (!course) return <div className="p-6"><h1>Course not found</h1></div>

  const courseModules = modules.filter((m) => m.courseId === courseId).sort((a, b) => a.order - b.order)
  const facilitator = users.find((u) => u.id === course.facilitatorId)
  const enrolledStudents = enrollments.filter((e) => e.courseId === courseId).map((e) => users.find((u) => u.id === e.userId)).filter(Boolean)
  const isEnrolled = enrollments.some((e) => e.userId === user.id && e.courseId === courseId)
  const isAdmin = user.role === "Admin"
  const isFacilitator = user.role === "Facilitator" && course.facilitatorId === user.id
  const canEdit = isAdmin || isFacilitator

  const handleEnroll = () => {
    setEnrollments([...enrollments, { userId: user.id, courseId }])
    router.refresh()
  }

  const handleAddModule = () => {
    if (!newModule.title) {
      toast.error("Module title is required")
      return
    }
    const newMod = {
      id: modules.length + 1,
      courseId,
      title: newModule.title,
      description: newModule.description,
      order: modules.length + 1,
    }
    setModules([...modules, newMod])
    setModuleDialogOpen(false)
    setNewModule({ title: "", description: "" })
    toast.success("Module added successfully")
  }

  const handleCreateAssessment = () => {
    if (!newAssessment.title) {
      toast.error("Assessment title is required")
      return
    }
    if (newAssessment.type === "Quiz") {
      const newQuiz = {
        id: quizzes.length + 1,
        activityId: quizzes.length + 1,
        moduleId: courseModules[0]?.id || 1,
        title: newAssessment.title,
        description: newAssessment.description,
        dueDate: newAssessment.dueDate || "2026-12-31",
        timeLimit: 30,
        questions: [],
      }
      setQuizzes([...quizzes, newQuiz])
    } else {
      const newAssignment = {
        id: assignments.length + 1,
        moduleId: courseModules[0]?.id || 1,
        courseId,
        title: newAssessment.title,
        description: newAssessment.description,
        dueDate: newAssessment.dueDate || "2026-12-31",
        attachments: [],
      }
      setAssignments([...assignments, newAssignment])
    }
    setAssessmentDialogOpen(false)
    setNewAssessment({ type: "Quiz", title: "", description: "", dueDate: "" })
    toast.success(`${newAssessment.type} created successfully`)
  }

  const availableFacilitators = users.filter((u) => u.role === "Facilitator" && u.status === "Active")

  const handleAssignFacilitator = () => {
    if (!selectedFacilitatorId) {
      toast.error("Please select a facilitator")
      return
    }
    const facId = Number(selectedFacilitatorId)
    const courseIdx = courses.findIndex((c) => c.id === courseId)
    if (courseIdx !== -1) {
      const updated = [...courses]
      updated[courseIdx] = { ...updated[courseIdx], facilitatorId: facId }
      setCourses(updated)
    }
    setFacilitatorDialogOpen(false)
    toast.success("Facilitator assigned successfully")
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <button onClick={() => router.push("/courses")} className="hover:text-gold">Courses</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{course.title}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up" style={{ animationDelay: "40ms" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>{course.title}</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">{course.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={course.status === "Active" ? "default" : "secondary"}
            className={`${course.status === "Active" ? "bg-success text-white hover:bg-success/90 border-0" : "bg-warning text-white hover:bg-warning/90 border-0"}`}>
            {course.status}
          </Badge>
          {user.role === "Student" && !isEnrolled && course.status === "Active" && (
            <Button onClick={handleEnroll}>Enroll Now</Button>
          )}
          {user.role === "Student" && isEnrolled && (
            <Badge variant="default" className="bg-success text-white hover:bg-success/90 border-0">Enrolled</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="modules" className="animate-slide-up" style={{ animationDelay: "80ms" }}>
        <TabsList>
          <TabsTrigger value="modules">Modules & Lessons</TabsTrigger>
          {isEnrolled && <TabsTrigger value="gradebook">Gradebook</TabsTrigger>}
          {canEdit && <TabsTrigger value="manage">Manage</TabsTrigger>}
          <TabsTrigger value="students">Students ({enrolledStudents.length})</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-6 space-y-4">
            {courseModules.length === 0 ? (
              <Card className="border-0 shadow-card">
                <CardContent className="text-center py-12 text-muted-foreground">No modules have been created yet.</CardContent>
              </Card>
            ) : (
              courseModules.map((mod, idx) => {
                const moduleLessons = lessons.filter((l) => l.moduleId === mod.id)
                const moduleQuizzes = quizzes.filter((q) => q.moduleId === mod.id)
                const moduleAssignments = assignments.filter((a) => a.moduleId === mod.id && a.courseId === courseId)


              const moveModule = (dir: "up" | "down") => {
                const targetIdx = dir === "up" ? idx - 1 : idx + 1
                if (targetIdx < 0 || targetIdx >= courseModules.length) return
                const updated = [...modules]
                const aIdx = updated.findIndex((m) => m.id === courseModules[idx].id)
                const bIdx = updated.findIndex((m) => m.id === courseModules[targetIdx].id)
                if (aIdx === -1 || bIdx === -1) return
                const temp = updated[aIdx].order
                updated[aIdx] = { ...updated[aIdx], order: updated[bIdx].order }
                updated[bIdx] = { ...updated[bIdx], order: temp }
                setModules(updated)
                toast.success(`Module moved ${dir}`)
              }

              return (
                <Card key={mod.id} className="border-0 shadow-card card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 flex-1">
                        {canEdit && (
                          <div className="flex flex-col gap-0.5 mt-1 shrink-0">
                            <button onClick={() => moveModule("up")} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button onClick={() => moveModule("down")} disabled={idx === courseModules.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed">
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-base">
                            Module {idx + 1}: {mod.title}
                          </CardTitle>
                          <CardDescription>{mod.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">{moduleLessons.length} lessons</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {moduleLessons.map((lesson) => (
                      <div key={lesson.id} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer" onClick={() => router.push(`/courses/${courseId}/modules/${mod.id}`)}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <FileText className="w-4 h-4 text-gold mt-0.5" />
                            <div>
                              <p className="font-medium text-sm">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lesson.content}</p>
                              {lesson.resources.length > 0 && (
                                <p className="text-xs text-gold mt-1">{lesson.resources.length} resource(s)</p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      </div>
                    ))}

                    {moduleQuizzes.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground uppercase">Assessments</p>
                        {moduleQuizzes.map((quiz) => (
                          <div key={quiz.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-gold" />
                              <div>
                                <p className="text-sm font-medium">{quiz.title}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Clock className="w-3 h-3" /> {quiz.timeLimit} min &middot; {quiz.questions.length} questions
                                </p>
                              </div>
                            </div>
                            {isEnrolled && (
                              <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${mod.id}/quizzes/${quiz.id}`)}>
                                Start
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {moduleAssignments.length > 0 && (
                      <div className="space-y-2">
                        {moduleAssignments.map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gold" />
                              <div>
                                <p className="text-sm font-medium">{assignment.title}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                  Due: {assignment.dueDate} {assignment.timeLimit && <><Clock className="w-3 h-3" /> {assignment.timeLimit} min</>}
                                </p>
                              </div>
                            </div>
                            {isEnrolled && (
                              <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${mod.id}/assignments/${assignment.id}`)}>
                                Submit
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        {isEnrolled && (
          <TabsContent value="gradebook" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Gradebook</CardTitle>
                <CardDescription>Your assessment results for this course</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const grades = gradebook.filter((g) => g.userId === user.id && g.courseId === courseId)
                  if (grades.length === 0) return <p className="text-sm text-muted-foreground text-center py-8">No grades available yet.</p>
                  const avg = Math.round(grades.reduce((s, g) => s + (g.score / g.total) * 100, 0) / grades.length)
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="font-medium">Overall Average</span>
                        <span className={`text-2xl font-bold ${avg >= 50 ? "text-success" : "text-destructive"}`}>{avg}%</span>
                      </div>
                      <div className="divide-y">
                        {grades.map((g) => (
                          <div key={g.id} className="flex items-center justify-between py-3">
                            <div>
                              <p className="font-medium text-sm">{g.activityName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{g.activityType}</Badge>
                                <span>{g.date}</span>
                              </div>
                            </div>
                            <span className={`font-semibold ${(g.score / g.total) >= 0.5 ? "text-success" : "text-destructive"}`}>
                              {g.score}/{g.total} ({Math.round((g.score / g.total) * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canEdit && (
          <TabsContent value="manage" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>Manage course content and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Plus className="w-4 h-4 mr-1" /> Add Module
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Module</DialogTitle>
                        <DialogDescription>Create a new module for {course.title}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="mod-title">Module Title</Label>
                          <Input id="mod-title" value={newModule.title} onChange={(e) => setNewModule({ ...newModule, title: e.target.value })} placeholder="Enter module title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mod-desc">Description</Label>
                          <Textarea id="mod-desc" value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} placeholder="Enter module description" rows={3} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddModule}>Add Module</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <HelpCircle className="w-4 h-4 mr-1" /> Create Assessment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Assessment</DialogTitle>
                        <DialogDescription>Add a quiz or assignment to {course.title}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="as-type">Type</Label>
                          <Select value={newAssessment.type} onValueChange={(v) => setNewAssessment({ ...newAssessment, type: v })}>
                            <SelectTrigger id="as-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Quiz">Quiz</SelectItem>
                              <SelectItem value="Assignment">Assignment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="as-title">Title</Label>
                          <Input id="as-title" value={newAssessment.title} onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })} placeholder="Enter assessment title" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="as-desc">Description</Label>
                          <Textarea id="as-desc" value={newAssessment.description} onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })} placeholder="Enter assessment description" rows={3} />
                        </div>
                        {newAssessment.type === "Assignment" && (
                          <div className="space-y-2">
                            <Label htmlFor="as-due">Due Date</Label>
                            <Input id="as-due" type="date" value={newAssessment.dueDate} onChange={(e) => setNewAssessment({ ...newAssessment, dueDate: e.target.value })} />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateAssessment}>Create {newAssessment.type}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {isAdmin && (
                    <Dialog open={facilitatorDialogOpen} onOpenChange={setFacilitatorDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <UserCheck className="w-4 h-4 mr-1" /> Assign Facilitator
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Facilitator</DialogTitle>
                          <DialogDescription>Assign a facilitator to {course.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="fac-select">Facilitator</Label>
                            <Select value={selectedFacilitatorId} onValueChange={setSelectedFacilitatorId}>
                              <SelectTrigger id="fac-select">
                                <SelectValue placeholder="Select a facilitator" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFacilitators.map((f) => (
                                  <SelectItem key={f.id} value={f.id.toString()}>
                                    {f.firstName} {f.lastName} ({f.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setFacilitatorDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAssignFacilitator}>Assign</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Course Info</p>
                  <p className="text-xs text-muted-foreground">
                    Duration: {course.startDate} to {course.endDate}
                    {facilitator ? ` | Facilitator: ${facilitator.firstName} ${facilitator.lastName}` : " | No facilitator assigned"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="students" className="mt-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Enrolled Students ({enrolledStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {enrolledStudents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No students enrolled yet.</p>
              ) : (
                <div className="divide-y">
                  {enrolledStudents.map((s) => s && (
                    <div key={s.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-gold text-black flex items-center justify-center text-sm font-medium">
                          {s.firstName[0]}{s.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                      <Badge variant={s.status === "Active" ? "default" : "secondary"}
                        className={s.status === "Active" ? "bg-success text-white hover:bg-success/90 border-0" : ""}>
                        {s.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Discussions</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Discussion</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Start a Discussion</DialogTitle>
                    <DialogDescription>Post a question or topic for discussion.</DialogDescription>
                  </DialogHeader>
                  <NewDiscussionForm courseId={courseId} user={user} discussions={discussions} setDiscussions={setDiscussions} />
                </DialogContent>
              </Dialog>
            </div>
            {discussions.filter((d) => d.courseId === courseId).length === 0 ? (
              <Card className="border-0 shadow-card">
                <CardContent className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No discussions yet. Start one!</p>
                </CardContent>
              </Card>
            ) : (
              discussions.filter((d) => d.courseId === courseId).map((disc) => {
                const author = users.find((u) => u.id === disc.userId)
                const replies = discussionReplies.filter((r) => r.discussionId === disc.id)
                return (
                  <Card key={disc.id} className="border-0 shadow-card card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${disc.pinned ? "bg-gold text-black" : "bg-muted text-muted-foreground"}`}>
                            {author ? `${author.firstName[0]}${author.lastName[0]}` : "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{disc.title}</CardTitle>
                              {disc.pinned && <Badge className="bg-gold text-black text-[10px]">Pinned</Badge>}
                              {disc.resolved && <Badge className="bg-success text-white text-[10px]">Resolved</Badge>}
                            </div>
                            <CardDescription>
                              {author ? `${author.firstName} ${author.lastName}` : "Unknown"} &middot; {new Date(disc.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline">{replies.length} replies</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{disc.content}</p>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Reviews & Ratings</h2>
              {isEnrolled && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Star className="w-4 h-4 mr-1" /> Write a Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                      <DialogDescription>Share your experience with this course.</DialogDescription>
                    </DialogHeader>
                    <NewReviewForm courseId={courseId} userId={user.id} courseReviews={courseReviews} setCourseReviews={setCourseReviews} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {(() => {
              const reviews = courseReviews.filter((r) => r.courseId === courseId)
              const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0
              return (
                <>
                  {reviews.length > 0 && (
                    <Card className="border-0 shadow-card bg-muted/30">
                      <CardContent className="flex items-center gap-4 py-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(avgRating) ? "text-gold fill-gold" : "text-muted"}`} />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{reviews.length} review(s)</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {reviews.length === 0 ? (
                    <Card className="border-0 shadow-card">
                      <CardContent className="text-center py-12 text-muted-foreground">
                        <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No reviews yet. Be the first!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reviews.map((review) => {
                      const reviewer = users.find((u) => u.id === review.userId)
                      return (
                        <Card key={review.id} className="border-0 shadow-card">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-gold text-black flex items-center justify-center text-xs font-medium">
                                  {reviewer ? `${reviewer.firstName[0]}${reviewer.lastName[0]}` : "U"}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "Unknown"}</p>
                                  <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map((star) => (
                                      <Star key={star} className={`w-3 h-3 ${star <= review.rating ? "text-gold fill-gold" : "text-muted"}`} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </>
              )
            })()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
