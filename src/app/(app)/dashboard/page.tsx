"use client"

import { useAuth } from "../../../lib/auth-context"
import {
  mockCourses, mockAnnouncements, mockNotifications,
  mockCalendarEvents, mockEnrollments, mockFacilitatorApplications,
  mockModules, mockCourseProgress, mockSubmissions, mockAssignments,
} from "../../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen, Users, Megaphone, Bell,
  CalendarDays, CheckCircle, XCircle,
  ArrowRight, GraduationCap, Sparkles,
} from "lucide-react"

export default function Dashboard() {
  const { user, users, setUsers } = useAuth()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const role = user?.role

  if (!user) return null

  const myEnrollments = mockEnrollments.filter((e) => e.userId === user.id)
  const myCourses = mockCourses.filter((c) => myEnrollments.some((e) => e.courseId === c.id))
  const availableCourses = mockCourses.filter((c) => !myEnrollments.some((e) => e.courseId === c.id) && c.status === "Active")
  const announcements = mockAnnouncements.filter((a) => a.targetAudience === "All" || (role && a.targetAudience === `${role}s`))
  const unreadNotifications = mockNotifications.filter((n) => n.userId === user.id && !n.read)
  const todayEvents = mockCalendarEvents.filter((e) => e.date >= new Date().toISOString().split("T")[0]).slice(0, 5)

  const pendingApplications = mockFacilitatorApplications.filter((a) => a.status === "Pending")
  const pendingFacilitators = users.filter((u) => u.role === "Facilitator" && u.status === "Pending")

  const handleApprove = (userId: number) => {
    setUsers(users.map((u) => u.id === userId ? { ...u, status: "Active" as const } : u))
  }

  const handleDecline = (userId: number) => {
    setUsers(users.map((u) => u.id === userId ? { ...u, status: "Suspended" as const } : u))
  }

  const adminStats = [
    { label: "Total Users", value: users.length, sub: `${users.filter((u) => u.role === "Student").length} Students, ${users.filter((u) => u.role === "Facilitator").length} Facilitators`, icon: Users, color: "from-blue-600 to-blue-400" },
    { label: "Total Courses", value: mockCourses.length, sub: `${mockCourses.filter((c) => c.status === "Active").length} Active`, icon: BookOpen, color: "from-emerald-600 to-emerald-400" },
    { label: "Facilitator Applications", value: pendingApplications.length, sub: "Pending approval", icon: Sparkles, color: "from-amber-600 to-amber-400" },
    { label: "Pending Facilitators", value: pendingFacilitators.length, sub: "Awaiting activation", icon: Users, color: "from-rose-600 to-rose-400" },
  ]

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {user.status === "Pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-slide-up">
          <p className="text-amber-800 text-sm font-medium">Your account is pending approval. Some features may be limited until an administrator activates your account.</p>
        </div>
      )}
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Welcome, {user.firstName} {user.lastName}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {role === "Student" && "Track your courses, assessments, and grades."}
              {role === "Facilitator" && "Manage your courses, content, and students."}
              {role === "Admin" && "Oversee users, courses, and system announcements."}
            </p>
          </div>
        </div>
      </div>

      {role === "Admin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {adminStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="card-hover border-0 shadow-card overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`h-1.5 bg-gradient-to-r ${stat.color}`} />
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-muted-foreground font-medium">{stat.label}</CardTitle>
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {role === "Student" && (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
          {myCourses.length > 0 && (
            <div>
              <h2 className="mb-4">My Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCourses.map((course) => {
                  const courseMods = mockModules.filter((m) => m.courseId === course.id)
                  const progress = mockCourseProgress.find((p) => p.userId === user.id && p.courseId === course.id)
                  const completedCount = progress?.completedModuleIds.length || 0
                  const totalCount = courseMods.length || 1
                  const pct = Math.round((completedCount / totalCount) * 100)
                  return (
                    <Card key={course.id} className="card-hover border-0 shadow-card cursor-pointer" onClick={() => router.push(`/courses/${course.id}`)}>
                      <div className="h-2 bg-gradient-gold rounded-t-lg" />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {courseMods.length} Modules</span>
                          <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Ends {course.endDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-gold rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground shrink-0">{pct}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {availableCourses.length > 0 && (
            <Card className="border-0 shadow-card card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-gold" /> Available Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{course.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                      </div>
                      <Button size="sm" className="ml-3 shrink-0" onClick={() => router.push(`/courses/${course.id}`)}>
                        View Course
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {role === "Facilitator" && (
        <div className="space-y-6">
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <h2 className="mb-4">My Facilitated Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const myFacilitatedCourses = mockCourses.filter((c) => c.facilitatorId === user.id)
                return myFacilitatedCourses.length > 0 ? myFacilitatedCourses.map((course) => {
                  const enrolled = mockEnrollments.filter((e) => e.courseId === course.id)
                  const courseAssignments = mockAssignments.filter((a) => a.courseId === course.id)
                  const pendingGrading = mockSubmissions.filter((s) => s.activityType === "assignment" && !s.graded && courseAssignments.some((a) => a.id === s.activityId))
                  return (
                    <Card key={course.id} className="card-hover border-0 shadow-card cursor-pointer" onClick={() => router.push(`/courses/${course.id}`)}>
                      <div className="h-2 bg-gradient-gold rounded-t-lg" />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {enrolled.length} Students</span>
                          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-warning" /> {pendingGrading.length} to grade</span>
                        </div>
                        <Badge variant={course.status === "Active" ? "default" : "secondary"} className={`mt-2 ${course.status === "Active" ? "bg-success text-white" : ""}`}>{course.status}</Badge>
                      </CardContent>
                    </Card>
                  )
                }) : (
                  <Card className="col-span-full border-0 shadow-card">
                    <CardContent className="text-center py-12 text-muted-foreground">
                      You are not assigned to any courses yet.
                    </CardContent>
                  </Card>
                )
              })()}
            </div>
          </div>
          {(() => {
            const myCourseIds = mockCourses.filter((c) => c.facilitatorId === user.id).map((c) => c.id)
            const myAssignments = mockAssignments.filter((a) => myCourseIds.includes(a.courseId))
            const pendingSubmissions = mockSubmissions.filter((s) => s.activityType === "assignment" && !s.graded && myAssignments.some((a) => a.id === s.activityId))
            if (pendingSubmissions.length === 0) return null
            return (
              <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "150ms" }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><CheckCircle className="w-4 h-4 text-warning" /> Pending Grading ({pendingSubmissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingSubmissions.map((sub) => {
                      const student = users.find((u) => u.id === sub.userId)
                      const assignment = mockAssignments.find((a) => a.id === sub.activityId)
                      return (
                        <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm">{student ? `${student.firstName} ${student.lastName}` : `User #${sub.userId}`}</p>
                            <p className="text-xs text-muted-foreground">{assignment?.title || "Assignment"} &middot; Submitted {new Date(sub.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <Button size="sm" onClick={() => router.push(`/courses/${assignment?.courseId || ""}/modules/1/assignments/${sub.activityId}`)}>
                            Grade
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <Card className="border-0 shadow-card card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Megaphone className="w-4 h-4 text-gold" /> Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.slice(0, 4).map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-muted-foreground">{a.date}</span>
                        <Badge variant="outline" className={
                          a.priority === "High" ? "text-destructive border-destructive/30 text-[10px] px-1.5 py-0" :
                          a.priority === "Medium" ? "text-warning border-warning/30 text-[10px] px-1.5 py-0" :
                          "text-success border-success/30 text-[10px] px-1.5 py-0"
                        }>{a.priority}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>}
              {announcements.length > 4 && (
                <Button variant="ghost" size="sm" className="w-full text-gold hover:text-gold-dark hover:bg-gold/5" onClick={() => router.push("/announcements")}>
                  View All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {role === "Student" && (
          <Card className="border-0 shadow-card card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><Bell className="w-4 h-4 text-gold" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {unreadNotifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                ) : (
                  unreadNotifications.slice(0, 4).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer" onClick={() => n.link && router.push(n.link)}>
                      <div className="w-2 h-2 mt-2 rounded-full bg-gold shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(n.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-card card-hover">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="w-4 h-4 text-gold" /> Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
            <div className="space-y-2">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">No upcoming events</p>
              ) : (
                todayEvents.map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.date}</p>
                    </div>
                    <Badge variant={e.type === "exam" ? "destructive" : e.type === "assignment" ? "default" : "secondary"} className="text-[10px] px-1.5 py-0 shrink-0 ml-2">{e.type}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {role === "Admin" && pendingApplications.length > 0 && (
        <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="text-base">Pending Facilitator Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingApplications.map((app) => {
                const applicant = users.find((u) => u.id === app.userId)
                return (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{applicant ? `${applicant.firstName} ${applicant.lastName}` : `User #${app.userId}`}</p>
                      <p className="text-xs text-muted-foreground">{app.subject} &mdash; {app.qualifications}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{app.date}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3">
                      <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={() => handleApprove(app.userId)}>
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDecline(app.userId)}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
