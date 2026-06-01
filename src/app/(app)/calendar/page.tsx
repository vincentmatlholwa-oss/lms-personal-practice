"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "../../../components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { mockCalendarEvents, mockCourses } from "../../../lib/mock-data"
import { useAuth } from "../../../lib/auth-context"
import { CalendarDays, CalendarIcon, ArrowLeft } from "lucide-react"

export default function CalendarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())

  if (!user) return null

  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""
  const selectedEvents = mockCalendarEvents.filter((e) => e.date === selectedDateStr)
  const allEvents = [...mockCalendarEvents].sort((a, b) => a.date.localeCompare(b.date))

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "exam": return "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0"
      case "assignment": return "bg-gold text-black hover:bg-gold/90 border-0"
      default: return "bg-muted text-muted-foreground border-0"
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Calendar</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Track upcoming assessments and events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-slide-up" style={{ animationDelay: "80ms" }}>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border mx-auto" />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>
              {selectedDateStr ? `Events on ${selectedDateStr}` : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No events on this date</p>
            ) : (
              selectedEvents.map((e) => {
                const course = mockCourses.find((c) => c.id === e.courseId)
                return (
                  <div key={e.id} className="flex items-center justify-between p-3 border rounded-lg card-hover">
                    <div>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{course?.title || "General"}</p>
                    </div>
                    <Badge className={getBadgeClass(e.type)}>
                      {e.type}
                    </Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "120ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gold" /> All Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {allEvents.map((e) => {
              const course = mockCourses.find((c) => c.id === e.courseId)
              return (
                <div key={e.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center text-xs">
                      <span className="font-bold">{new Date(e.date).getDate()}</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(e.date).toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{course?.title || "General"} &middot; {e.date}</p>
                    </div>
                  </div>
                  <Badge className={getBadgeClass(e.type)}>
                    {e.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
