"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../../lib/auth-context"
import { mockCourses, mockModules, mockEnrollments } from "../../../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog"
import { BookOpen, Plus, Search, Users, GraduationCap } from "lucide-react"
import { toast } from "sonner"

export default function CoursesCatalog() {
  const { user, users } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState(mockCourses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "", startDate: "", endDate: "" })

  if (!user) return null

  const isAdmin = user.role === "Admin"
  const isFacilitator = user.role === "Facilitator"

  const enrolledIds = mockEnrollments.filter((e) => e.userId === user.id).map((e) => e.courseId)

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Title and description are required")
      return
    }
    const course = {
      id: courses.length + 1,
      ...newCourse,
      facilitatorId: null,
      status: "Active" as const,
    }
    setCourses([...courses, course])
    setIsDialogOpen(false)
    setNewCourse({ title: "", description: "", startDate: "", endDate: "" })
    toast.success("Course created successfully")
  }

  const handleToggleStatus = (courseId: number) => {
    setCourses(courses.map((c) =>
      c.id === courseId ? { ...c, status: c.status === "Active" ? "Suspended" as const : "Active" as const } : c
    ))
  }

  const handleEnroll = (courseId: number) => {
    if (enrolledIds.includes(courseId)) {
      toast.error("Already enrolled in this course")
      return
    }
    mockEnrollments.push({ userId: user.id, courseId })
    toast.success("Successfully enrolled!")
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Courses</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {isAdmin ? "Manage all courses in the system" : isFacilitator ? "Your assigned courses" : "Browse and enroll in courses"}
            </p>
          </div>
        </div>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>Add a new course to the LMS.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Enter course title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Input id="desc" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="Enter course description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start Date</Label>
                    <Input id="start" type="date" value={newCourse.startDate} onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End Date</Label>
                    <Input id="end" type="date" value={newCourse.endDate} onChange={(e) => setNewCourse({ ...newCourse, endDate: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCourse}>Create Course</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative max-w-sm animate-slide-up" style={{ animationDelay: "80ms" }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up" style={{ animationDelay: "120ms" }}>
        {filtered.map((course) => {
          const courseModules = mockModules.filter((m) => m.courseId === course.id)
          const facilitator = users.find((u) => u.id === course.facilitatorId)
          const isEnrolled = enrolledIds.includes(course.id)

          return (
            <Card key={course.id} className="card-hover border-0 shadow-card">
              <div className={`h-1.5 rounded-t-lg ${course.status === "Active" ? "bg-gradient-gold" : "bg-muted"}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base flex-1">{course.title}</CardTitle>
                  <Badge variant={course.status === "Active" ? "default" : "secondary"}
                    className={`${course.status === "Active" ? "bg-success text-white hover:bg-success/90 border-0" : "bg-warning text-white hover:bg-warning/90 border-0"} shrink-0 ml-2`}>
                    {course.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {courseModules.length} Modules</span>
                  {facilitator && <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {facilitator.firstName} {facilitator.lastName}</span>}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => router.push(`/courses/${course.id}`)}>
                    View Details
                  </Button>
                  {user.role === "Student" && course.status === "Active" && (
                    <Button size="sm" disabled={isEnrolled} onClick={() => handleEnroll(course.id)}>
                      {isEnrolled ? "Enrolled" : "Enroll"}
                    </Button>
                  )}
                  {isAdmin && (
                    <Button size="sm" variant={course.status === "Active" ? "destructive" : "default"}
                      onClick={() => handleToggleStatus(course.id)}>
                      {course.status === "Active" ? "Suspend" : "Activate"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="border-0 shadow-card">
          <CardContent className="text-center py-12 text-muted-foreground">
            No courses found matching your search.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
