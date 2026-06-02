"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../../../../../lib/auth-context"
import { useData } from "../../../../../../lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card"
import { Badge } from "../../../../../../components/ui/badge"
import { Button } from "../../../../../../components/ui/button"
import { ChevronRight, FileText, ClipboardList, Download, BookOpen } from "lucide-react"

export default function ModuleDetail() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { modules, quizzes, assignments, lessons, activities } = useData()
  const courseId = Number(params.courseId)
  const moduleId = Number(params.moduleId)

  if (!user) return null

  const mod = modules.find((m) => m.id === moduleId && m.courseId === courseId)
  if (!mod) return <div className="p-6"><h1>Module not found</h1></div>

  const moduleLessons = lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.order - b.order)
  const moduleQuizzes = quizzes.filter((q) => q.moduleId === moduleId)
  const moduleAssignments = assignments.filter((a) => a.moduleId === moduleId && a.courseId === courseId)

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <button onClick={() => router.push(`/courses`)} className="hover:text-gold">Courses</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => router.push(`/courses/${courseId}`)} className="hover:text-gold">Course</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{mod.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "40ms" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>{mod.title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{mod.description}</p>
        </div>
      </div>

      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
        {moduleLessons.map((lesson) => (
          <Card key={lesson.id} className="border-0 shadow-card card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                {lesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{lesson.content}</p>
              {lesson.resources.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.resources.map((r, i) => (
                      <a key={i} href={r.url} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-md text-sm hover:bg-accent">
                        <Download className="w-3 h-3" />
                        {r.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {(() => {
                const lessonActivities = activities.filter((a) => a.lessonId === lesson.id)
                if (lessonActivities.length === 0) return null
                return (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase">Activities</p>
                    {lessonActivities.map((act) => (
                      <div key={act.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-gold" />
                          <div>
                            <p className="text-sm font-medium">{act.title}</p>
                            <p className="text-xs text-muted-foreground">{act.description} &middot; Due: {act.dueDate}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{act.type}</Badge>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        ))}
      </div>

      {moduleQuizzes.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h2 className="mb-3">Quizzes</h2>
          <div className="space-y-3">
            {moduleQuizzes.map((quiz) => (
              <Card key={quiz.id} className="border-0 shadow-card card-hover">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-xs text-muted-foreground">{quiz.questions.length} questions &middot; {quiz.timeLimit} min &middot; Due: {quiz.dueDate}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}`)}>
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {moduleAssignments.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
          <h2 className="mb-3">Assignments</h2>
          <div className="space-y-3">
            {moduleAssignments.map((assignment) => (
              <Card key={assignment.id} className="border-0 shadow-card card-hover">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <div>
                      <p className="font-medium">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">{assignment.description} &middot; Due: {assignment.dueDate}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}/assignments/${assignment.id}`)}>
                    Submit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
