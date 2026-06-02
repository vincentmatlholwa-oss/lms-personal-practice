"use client"

import { useAuth } from "../../../lib/auth-context"
import { useData } from "../../../lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { useRouter } from "next/navigation"
import { BookOpen, CalendarDays, GraduationCap, Sparkles, ArrowLeft } from "lucide-react"

export default function MyCourses() {
  const { user } = useAuth()
  const router = useRouter()
  const { courses, modules, enrollments, gradebook, courseProgress } = useData()

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.userId === user.id)
  const myCourses = courses.filter((c) => myEnrollments.some((e) => e.courseId === c.id))
  const availableCourses = courses.filter((c) => !myEnrollments.some((e) => e.courseId === c.id) && c.status === "Active")

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1>My Courses</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Courses you are enrolled in</p>
        </div>
      </div>

      {myCourses.length === 0 ? (
        <Card className="border-0 shadow-card animate-slide-up">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Courses Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Browse available courses and enroll to get started on your learning journey.</p>
            <Button onClick={() => router.push("/courses")}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up">
          {myCourses.map((course, i) => {
            const courseModules = modules.filter((m) => m.courseId === course.id)
            const grades = gradebook.filter((g) => g.userId === user.id && g.courseId === course.id)
            const avgGrade = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + (g.score / g.total) * 100, 0) / grades.length) : null
            const progress = courseProgress.find((p) => p.userId === user.id && p.courseId === course.id)
            const completedCount = progress?.completedModuleIds.length || 0
            const totalCount = courseModules.length || 1
            const pct = Math.round((completedCount / totalCount) * 100)
            return (
              <Card key={course.id} className="card-hover border-0 shadow-card cursor-pointer" onClick={() => router.push(`/courses/${course.id}`)} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-2 bg-gradient-gold rounded-t-lg" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {courseModules.length} Modules</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Ends {course.endDate}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-gold rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground shrink-0">{pct}% complete</span>
                  </div>
                  {avgGrade !== null && (
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs text-muted-foreground">Average Grade</span>
                      <span className={`text-sm font-bold ${avgGrade >= 50 ? "text-success" : "text-destructive"}`}>{avgGrade}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {availableCourses.length > 0 && (
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <h2>Available Courses</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCourses.slice(0, 3).map((course) => (
              <Card key={course.id} className="border-0 shadow-card card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <Button size="sm" className="w-full" onClick={() => router.push(`/courses/${course.id}`)}>
                    View & Enroll
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {availableCourses.length > 3 && (
            <Button variant="ghost" className="mt-4 text-gold hover:text-gold-dark" onClick={() => router.push("/courses")}>
              View all {availableCourses.length} available courses
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
