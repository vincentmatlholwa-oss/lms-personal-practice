"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { useData } from "../../../lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { BarChart3, ArrowLeft, BookOpen, Users, CheckCircle, Award, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const { user, users } = useAuth()
  const router = useRouter()
  const { courses, modules, enrollments, gradebook, submissions, courseProgress } = useData()

  if (!user || user.role !== "Admin") return <div className="p-6"><h1>Access denied</h1></div>

  const totalStudents = users.filter((u) => u.role === "Student" && u.status === "Active").length
  const totalFacilitators = users.filter((u) => u.role === "Facilitator" && u.status === "Active").length
  const activeCourses = courses.filter((c) => c.status === "Active").length
  const totalEnrollments = enrollments.length

  const courseStats = courses.map((course) => {
    const courseEnrollments = enrollments.filter((e) => e.courseId === course.id).length
    const courseMods = modules.filter((m) => m.courseId === course.id)
    const completed = courseProgress.filter((p) => p.courseId === course.id && p.completedModuleIds.length === courseMods.length).length
    const grades = gradebook.filter((g) => g.courseId === course.id)
    const avgGrade = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + (g.score / g.total) * 100, 0) / grades.length) : null
    return { ...course, enrollments: courseEnrollments, completed, avgGrade, totalModules: courseMods.length }
  })

  const overallAvg = (() => {
    const all = gradebook
    return all.length > 0 ? Math.round(all.reduce((s, g) => s + (g.score / g.total) * 100, 0) / all.length) : 0
  })()

  const pendingGrading = submissions.filter((s) => s.activityType === "assignment" && !s.graded).length

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Analytics</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Platform-wide statistics and insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
        {[
          { label: "Active Students", value: totalStudents, icon: Users, color: "from-blue-600 to-blue-400" },
          { label: "Active Facilitators", value: totalFacilitators, icon: Users, color: "from-emerald-600 to-emerald-400" },
          { label: "Active Courses", value: activeCourses, icon: BookOpen, color: "from-amber-600 to-amber-400" },
          { label: "Total Enrollments", value: totalEnrollments, icon: TrendingUp, color: "from-purple-600 to-purple-400" },
          { label: "Overall Avg Grade", value: `${overallAvg}%`, icon: Award, color: "from-rose-600 to-rose-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-0 shadow-card card-hover overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
              <CardHeader className="pb-2 pt-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground font-medium">{stat.label}</CardTitle>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: "120ms" }}>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> Course Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseStats.map((course) => {
                const completionRate = course.enrollments > 0 ? Math.round((course.completed / course.enrollments) * 100) : 0
                return (
                  <div key={course.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{course.title}</p>
                      <Badge variant="outline" className="text-[10px]">{course.status}</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <span>{course.enrollments} enrolled</span>
                      <span>{course.totalModules} modules</span>
                      <span>{course.avgGrade !== null ? `${course.avgGrade}% avg` : "N/A"}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${completionRate}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{completionRate}% completion</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="w-4 h-4 text-gold" /> Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Pending Grading</p>
                <p className="text-xs text-muted-foreground">Assignment submissions awaiting review</p>
              </div>
              <span className="text-xl font-bold text-warning">{pendingGrading}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Course Completions</p>
                <p className="text-xs text-muted-foreground">Students who completed all modules</p>
              </div>
              <span className="text-xl font-bold text-success">{courseProgress.filter((p) => {
                const courseMods = modules.filter((m) => m.courseId === p.courseId)
                return p.completedModuleIds.length === courseMods.length && courseMods.length > 0
              }).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Avg Score per Course</p>
                <p className="text-xs text-muted-foreground">Overall student performance</p>
              </div>
              <span className="text-xl font-bold text-primary">{overallAvg}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-sm font-medium">Facilitator Applications</p>
                <p className="text-xs text-muted-foreground">Pending approvals</p>
              </div>
              <span className="text-xl font-bold text-amber-500">
                {users.filter((u) => u.role === "Facilitator" && u.status === "Pending").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}