"use client"

import { useState } from "react"
import { useAuth } from "../../../../lib/auth-context"
import { mockFacilitatorApplications, mockNotifications } from "../../../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, UserCheck, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function FacilitatorApplicationsPage() {
  const { user, users, setUsers } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState(mockFacilitatorApplications)

  if (!user || user.role !== "Admin") return <div className="p-6"><h1>Access denied</h1></div>

  const handleApprove = (appId: number, userId: number) => {
    setApplications(applications.map((a) => a.id === appId ? { ...a, status: "Approved" as const } : a))
    setUsers(users.map((u) => u.id === userId ? { ...u, status: "Active" as const } : u))
    mockNotifications.push({
      id: mockNotifications.length + 1,
      userId,
      title: "Application Approved",
      message: "Your facilitator application has been approved. You can now sign in and start managing courses.",
      date: new Date().toISOString(),
      read: false,
      link: "/dashboard",
    })
    toast.success("Facilitator application approved")
  }

  const handleDecline = (appId: number, userId: number) => {
    setApplications(applications.map((a) => a.id === appId ? { ...a, status: "Declined" as const } : a))
    setUsers(users.map((u) => u.id === userId ? { ...u, status: "Suspended" as const } : u))
    mockNotifications.push({
      id: mockNotifications.length + 1,
      userId,
      title: "Application Declined",
      message: "Your facilitator application has been declined. Please contact an administrator for more information.",
      date: new Date().toISOString(),
      read: false,
    })
    toast.success("Facilitator application declined")
  }

  const pending = applications.filter((a) => a.status === "Pending")
  const history = applications.filter((a) => a.status !== "Pending")

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Facilitator Applications</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Review and manage facilitator registration requests</p>
        </div>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <CardTitle>Pending Applications ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No pending applications</p>
          ) : (
            <div className="space-y-3">
              {pending.map((app) => {
                const applicant = users.find((u) => u.id === app.userId)
                return (
                  <div key={app.id} className="p-4 border rounded-lg space-y-3 card-hover">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-base">{applicant ? `${applicant.firstName} ${applicant.lastName}` : `User #${app.userId}`}</p>
                        <p className="text-sm text-muted-foreground">{applicant?.email}</p>
                      </div>
                      <Badge variant="secondary" className="bg-warning text-warning-foreground hover:bg-warning/90 border-0">{app.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subject:</span>
                        <p className="font-medium">{app.subject}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">{app.date}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Qualifications:</span>
                      <p className="text-sm mt-1">{app.qualifications}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Experience:</span>
                      <p className="text-sm mt-1">{app.experience}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="bg-success text-white hover:bg-success/90" onClick={() => handleApprove(app.id, app.userId)}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDecline(app.id, app.userId)}>
                        <XCircle className="w-3 h-3 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "120ms" }}>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {history.map((app) => {
                const applicant = users.find((u) => u.id === app.userId)
                return (
                  <div key={app.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-sm">{applicant ? `${applicant.firstName} ${applicant.lastName}` : `User #${app.userId}`}</p>
                      <p className="text-xs text-muted-foreground">{app.subject} &middot; {app.date}</p>
                    </div>
                    <Badge variant={app.status === "Approved" ? "default" : "destructive"}
                      className={app.status === "Approved" ? "bg-success text-white hover:bg-success/90 border-0" : ""}>
                      {app.status}
                    </Badge>
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
