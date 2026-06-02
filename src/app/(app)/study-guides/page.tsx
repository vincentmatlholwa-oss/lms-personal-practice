"use client"

import { useAuth } from "../../../lib/auth-context"
import { useData } from "../../../lib/data-context"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { useRouter } from "next/navigation"
import { BookOpen, Download, FileText, GraduationCap, ArrowLeft } from "lucide-react"

export default function StudyGuidesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { courses, modules, enrollments } = useData()

  if (!user) return null

  const myEnrollments = enrollments.filter((e) => e.userId === user.id)
  const myCourses = courses.filter((c) => myEnrollments.some((e) => e.courseId === c.id))

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Study Guides</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Access course materials and study resources</p>
        </div>
      </div>

      {myCourses.length === 0 ? (
        <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
          <CardContent className="text-center py-12 text-muted-foreground">
            Enroll in a course to access study guides.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
          {myCourses.map((course) => {
            const courseModules = modules.filter((m) => m.courseId === course.id)
            return (
              <Card key={course.id} className="border-0 shadow-card card-hover">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold" />
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {courseModules.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{mod.title}</p>
                          <p className="text-xs text-muted-foreground">{mod.description}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/courses/${course.id}/modules/${mod.id}`)}>
                        <Download className="w-3 h-3 mr-1" /> View
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
