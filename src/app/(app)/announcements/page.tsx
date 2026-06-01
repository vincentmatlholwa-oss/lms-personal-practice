"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { mockAnnouncements as initialAnnouncements, mockCourses } from "../../../lib/mock-data"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Plus, Megaphone, Trash2, Calendar, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function Announcements() {
  const { user } = useAuth()
  const router = useRouter()
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [courseFilter, setCourseFilter] = useState("all")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "Medium",
    targetAudience: "All",
    courseId: "",
  })
  const canCreate = user?.role === "Admin" || user?.role === "Facilitator"

  const filtered = announcements.filter((a) => {
    if (courseFilter === "all") return true
    if (courseFilter === "general") return !a.courseId
    return a.courseId === Number(courseFilter)
  })

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error("Title and content are required")
      return
    }
    const announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      description: newAnnouncement.content,
      date: new Date().toISOString().split('T')[0],
      priority: newAnnouncement.priority as "High" | "Medium" | "Low",
      authorId: user?.id || 0,
      targetAudience: newAnnouncement.targetAudience as "All" | "Students" | "Facilitators" | "Admins",
      courseId: newAnnouncement.courseId ? Number(newAnnouncement.courseId) : undefined,
    }
    initialAnnouncements.unshift(announcement)
    setAnnouncements([...initialAnnouncements])
    setIsDialogOpen(false)
    setNewAnnouncement({ title: "", content: "", priority: "Medium", targetAudience: "All", courseId: "" })
    toast.success("Announcement published!")
  }

  const handleDeleteAnnouncement = (id: number) => {
    const idx = initialAnnouncements.findIndex((a) => a.id === id)
    if (idx !== -1) initialAnnouncements.splice(idx, 1)
    setAnnouncements([...initialAnnouncements])
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-0"
      case "Medium": return "bg-warning text-warning-foreground hover:bg-warning/90 border-0"
      case "Low": return "bg-success text-success-foreground hover:bg-success/90 border-0"
      default: return ""
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Announcements</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">View system-wide announcements</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Announcements</SelectItem>
              <SelectItem value="general">General</SelectItem>
              {mockCourses.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {canCreate && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>Broadcast an announcement to users.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ann-title">Title</Label>
                    <Input id="ann-title" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} placeholder="Enter announcement title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ann-content">Content</Label>
                    <Textarea id="ann-content" value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} placeholder="Enter announcement content" rows={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ann-course">Course (optional)</Label>
                    <Select value={newAnnouncement.courseId} onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, courseId: v })}>
                      <SelectTrigger id="ann-course"><SelectValue placeholder="All courses" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">General</SelectItem>
                        {mockCourses.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ann-audience">Target Audience</Label>
                    <Select value={newAnnouncement.targetAudience} onValueChange={(v) => setNewAnnouncement({ ...newAnnouncement, targetAudience: v })}>
                      <SelectTrigger id="ann-audience"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Users</SelectItem>
                        <SelectItem value="Students">Students Only</SelectItem>
                        <SelectItem value="Facilitators">Facilitators Only</SelectItem>
                        <SelectItem value="Admins">Admins Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <div className="flex gap-2">
                      {["Low", "Medium", "High"].map((priority) => (
                        <Button
                          key={priority}
                          type="button"
                          variant={newAnnouncement.priority === priority ? "default" : "outline"}
                          onClick={() => setNewAnnouncement({ ...newAnnouncement, priority })}
                          className={newAnnouncement.priority === priority ? getPriorityColor(priority) : ""}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateAnnouncement}>Publish</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
        {filtered.map((announcement) => {
          const course = announcement.courseId ? mockCourses.find((c) => c.id === announcement.courseId) : null
          return (
            <Card key={announcement.id} className="border-0 shadow-card card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base mb-2">{announcement.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {announcement.date}
                        </span>
                        <Badge className={getPriorityColor(announcement.priority)}>
                          {announcement.priority}
                        </Badge>
                        {course && (
                          <Badge variant="outline" className="text-[10px]">{course.title}</Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">{announcement.targetAudience}</Badge>
                      </div>
                    </div>
                  </div>
                  {canCreate && (
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteAnnouncement(announcement.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{announcement.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}