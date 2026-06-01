"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { mockCertificates, mockCourses, mockCourseProgress, mockModules } from "../../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Award, ArrowLeft, Download, GraduationCap } from "lucide-react"
import { toast } from "sonner"

export default function CertificatesPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) return null

  const userCerts = mockCertificates.filter((c) => c.userId === user.id)
  const myEnrolledCourses = mockCourses.filter((c) =>
    mockCourseProgress.some((p) => p.userId === user.id && p.courseId === c.id)
  )

  const issueCertificate = (courseId: number) => {
    const course = mockCourses.find((c) => c.id === courseId)
    if (!course) return
    const existing = mockCertificates.find((c) => c.userId === user.id && c.courseId === courseId)
    if (existing) {
      toast.error("Certificate already issued")
      return
    }
    const certId = `CERT-${user.id}-${courseId}-${mockCertificates.length + 1}`
    mockCertificates.push({
      id: mockCertificates.length + 1,
      userId: user.id,
      courseId,
      issuedAt: new Date().toISOString(),
      certificateId: certId,
    })
    toast.success("Certificate issued! You can now download it.")
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <Award className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Certificates</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Course completion certificates</p>
        </div>
      </div>

      {userCerts.length === 0 ? (
        <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No Certificates Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Complete all modules in a course to earn your certificate.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
          {userCerts.map((cert) => {
            const course = mockCourses.find((c) => c.id === cert.courseId)
            return (
              <Card key={cert.id} className="border-0 shadow-card card-hover overflow-hidden">
                <div className="h-2 bg-gradient-gold" />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                      <Award className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{course?.title || "Course"}</CardTitle>
                      <p className="text-xs text-muted-foreground">Issued {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg text-xs">
                    <p className="text-muted-foreground">Certificate ID: <span className="font-mono">{cert.certificateId}</span></p>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Certificate download started!")}>
                    <Download className="w-4 h-4 mr-2" /> Download Certificate
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {userCerts.length === 0 && myEnrolledCourses.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
          <h2 className="mb-4">Complete a Course</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myEnrolledCourses.map((course) => {
              const progress = mockCourseProgress.find((p) => p.userId === user.id && p.courseId === course.id)
              const courseMods = mockModules.filter((m) => m.courseId === course.id)
              const completed = progress?.completedModuleIds.length || 0
              const pct = Math.round((completed / (courseMods.length || 1)) * 100)
              return (
                <Card key={course.id} className="border-0 shadow-card card-hover cursor-pointer" onClick={() => router.push(`/courses/${course.id}`)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                    </div>
                    {pct === 100 && (
                      <Button size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); issueCertificate(course.id) }}>
                        <GraduationCap className="w-4 h-4 mr-1" /> Claim Certificate
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}