"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { useData } from "../../../lib/data-context"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { EmptyState } from "../../../components/empty-state"
import { Badge } from "../../../components/ui/badge"
import { Plus, MoreVertical, Eye, Pencil, Trash2, Ban, Play, UserPlus, UserMinus, GraduationCap, Search, BookOpen, ArrowLeft, BookX } from "lucide-react"
import { toast } from "sonner"

const facilitatorNames: Record<number, string> = {
  2: "Jane Smith", 3: "Bob Johnson", 4: "Alice Brown", 5: "Sarah Lee",
  6: "Mike Chen", 8: "Fiona Garcia",
}

type Course = {
  id: number
  title: string
  description: string
  facilitator: string
  facilitatorId: number | null
  students: number
  status: "Active" | "Suspended" | "Draft" | "Archived"
  startDate: string
  endDate: string
}

export default function Courses() {
  const { user, users } = useAuth()
  const router = useRouter()
  const { courses: allCourses, modules, enrollments, setEnrollments } = useData()
  const [courses, setCourses] = useState<Course[]>(() =>
    allCourses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      facilitator: c.facilitatorId ? facilitatorNames[c.facilitatorId] || "Unassigned" : "Unassigned",
      facilitatorId: c.facilitatorId,
      students: enrollments.filter((e) => e.courseId === c.id).length,
      status: c.status as Course["status"],
      startDate: c.startDate,
      endDate: c.endDate,
    }))
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFacilitatorDialogOpen, setIsFacilitatorDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [managingCourseFacilitator, setManagingCourseFacilitator] = useState<Course | null>(null)
  const [selectedFacilitator, setSelectedFacilitator] = useState<string>("Unassigned")
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    facilitator: user?.role === "Facilitator" ? `${user.firstName} ${user.lastName}` : "Unassigned",
    facilitatorId: user?.role === "Facilitator" ? user.id : null,
    status: "Draft",
    startDate: "",
    endDate: "",
  })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const isAdmin = user?.role === "Admin"
  const isFacilitator = user?.role === "Facilitator"
  const isStudent = user?.role === "Student"

  const activeFacilitators = users.filter((u) => u.role === "Facilitator" && u.status === "Active")
  const availableFacilitators = [
    { id: null, name: "Unassigned" },
    ...activeFacilitators.map((f) => ({ id: f.id, name: `${f.firstName} ${f.lastName}` })),
  ]

  const enrolledIds = enrollments.filter((e) => e.userId === user?.id).map((e) => e.courseId)

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateCourse = () => {
    const course: Course = {
      id: courses.length + 1,
      title: newCourse.title,
      description: newCourse.description,
      facilitator: newCourse.facilitator,
      facilitatorId: newCourse.facilitatorId,
      students: 0,
      status: newCourse.status as "Active" | "Suspended" | "Draft" | "Archived",
      startDate: newCourse.startDate,
      endDate: newCourse.endDate,
    }
    setCourses([...courses, course])
    allCourses.push({
      id: course.id,
      title: course.title,
      description: course.description,
      startDate: course.startDate,
      endDate: course.endDate,
      facilitatorId: course.facilitatorId,
      status: (course.status === "Suspended" ? "Suspended" : "Active") as "Active" | "Suspended",
    })
    setIsDialogOpen(false)
    toast.success("Course created successfully")
    setNewCourse({
      title: "",
      description: "",
      facilitator: isFacilitator && user ? `${user.firstName} ${user.lastName}` : "Unassigned",
      facilitatorId: isFacilitator && user ? user.id : null,
      status: "Draft",
      startDate: "",
      endDate: "",
    })
  }

  const handleUpdateCourse = () => {
    if (!editingCourse) return
    setCourses(courses.map(c =>
      c.id === editingCourse.id ? editingCourse : c
    ))
    const idx = allCourses.findIndex((c) => c.id === editingCourse.id)
    if (idx !== -1) {
      allCourses[idx] = {
        ...allCourses[idx],
        title: editingCourse.title,
        description: editingCourse.description,
        startDate: editingCourse.startDate,
        endDate: editingCourse.endDate,
        facilitatorId: editingCourse.facilitatorId,
        status: (editingCourse.status === "Suspended" ? "Suspended" : "Active") as "Active" | "Suspended",
      }
    }
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCourse = (id: number) => {
    setCourses(courses.filter((course) => course.id !== id))
    const idx = allCourses.findIndex((c) => c.id === id)
    if (idx !== -1) allCourses.splice(idx, 1)
  }

  const handleSuspendCourse = (id: number) => {
    setCourses(courses.map(c => {
      if (c.id !== id) return c
      const newStatus = c.status === "Suspended" ? "Active" : "Suspended"
      const idx = allCourses.findIndex((s) => s.id === id)
      if (idx !== -1) allCourses[idx] = { ...allCourses[idx], status: (newStatus === "Suspended" ? "Suspended" : "Active") as "Active" | "Suspended" }
      return { ...c, status: newStatus }
    }))
  }

  const handleEditClick = (course: Course) => {
    setEditingCourse({ ...course })
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingCourse(null)
    setNewCourse({
      title: "",
      description: "",
      facilitator: isFacilitator && user ? `${user.firstName} ${user.lastName}` : "Unassigned",
      facilitatorId: isFacilitator && user ? user.id : null,
      status: "Draft",
      startDate: "",
      endDate: "",
    })
  }

  const handleManageFacilitator = (course: Course) => {
    setManagingCourseFacilitator(course)
    setSelectedFacilitator(course.facilitator)
    setIsFacilitatorDialogOpen(true)
  }

  const handleAssignFacilitator = () => {
    if (!managingCourseFacilitator) return
    const facilitator = availableFacilitators.find(f => f.name === selectedFacilitator)
    setCourses(courses.map(c =>
      c.id === managingCourseFacilitator.id
        ? { ...c, facilitator: selectedFacilitator, facilitatorId: facilitator?.id ?? null }
        : c
    ))
    setIsFacilitatorDialogOpen(false)
    setManagingCourseFacilitator(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return "bg-success text-white hover:bg-success/90 border-0"
      case "Suspended": return "bg-warning text-white hover:bg-warning/90 border-0"
      case "Draft": return "bg-muted text-muted-foreground border-0"
      case "Archived": return "bg-destructive/10 text-destructive border-0"
      default: return ""
    }
  }

  if (!user) return null

  if (isStudent) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3 animate-slide-up">
          <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Course Catalog</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Browse and enroll in courses</p>
          </div>
        </div>
        <div className="relative max-w-sm animate-slide-up" style={{ animationDelay: "80ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-slide-up" style={{ animationDelay: "120ms" }}>
          {filtered.map((course) => {
            const courseModules = modules.filter((m) => m.courseId === course.id)
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
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => router.push(`/courses/${course.id}`)}>
                      View Details
                    </Button>
                    {course.status !== "Suspended" && (
                      <Button size="sm" disabled={isEnrolled} onClick={() => {
                        if (!isEnrolled && user) {
                          setEnrollments([...enrollments, { userId: user.id, courseId: course.id }])
                          setCourses((prev) => prev.map((c) =>
                            c.id === course.id ? { ...c, students: c.students + 1 } : c
                          ))
                          toast.success("Enrolled successfully!")
                        }
                      }}>
                        {isEnrolled ? "Enrolled" : "Enroll"}
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

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Courses Management</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Manage all courses and assignments</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Create New Course"}</DialogTitle>
              <DialogDescription>
                {editingCourse ? "Update course information" : "Add a new course to the LMS platform."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input
                  id="course-title"
                  value={editingCourse ? editingCourse.title : newCourse.title}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, title: e.target.value })
                    : setNewCourse({ ...newCourse, title: e.target.value })
                  }
                  placeholder="Enter course title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingCourse ? editingCourse.description : newCourse.description}
                  onChange={(e) => editingCourse
                    ? setEditingCourse({ ...editingCourse, description: e.target.value })
                    : setNewCourse({ ...newCourse, description: e.target.value })
                  }
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={editingCourse ? editingCourse.startDate : newCourse.startDate}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, startDate: e.target.value })
                      : setNewCourse({ ...newCourse, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={editingCourse ? editingCourse.endDate : newCourse.endDate}
                    onChange={(e) => editingCourse
                      ? setEditingCourse({ ...editingCourse, endDate: e.target.value })
                      : setNewCourse({ ...newCourse, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator">Facilitator</Label>
                <Select
                  value={editingCourse ? editingCourse.facilitator : newCourse.facilitator}
                  onValueChange={(value) => {
                    const facilitator = availableFacilitators.find(f => f.name === value)
                    if (editingCourse) {
                      setEditingCourse({ ...editingCourse, facilitator: value, facilitatorId: facilitator?.id ?? null })
                    } else {
                      setNewCourse({ ...newCourse, facilitator: value, facilitatorId: facilitator?.id ?? null })
                    }
                  }}
                >
                  <SelectTrigger id="facilitator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFacilitators.map(f => (
                      <SelectItem key={f.id ?? 'unassigned'} value={f.name}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-status">Status</Label>
                <Select
                  value={editingCourse ? editingCourse.status : newCourse.status}
                  onValueChange={(value) => editingCourse
                    ? setEditingCourse({ ...editingCourse, status: value as Course["status"] })
                    : setNewCourse({ ...newCourse, status: value as Course["status"] })
                  }
                >
                  <SelectTrigger id="course-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "80ms" }}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-11">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <CardTitle>All Courses ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Facilitator</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>
                    {course.facilitator === "Unassigned" ? (
                      <Badge variant="outline" className="text-destructive border-destructive">
                        Unassigned
                      </Badge>
                    ) : (
                      course.facilitator
                    )}
                  </TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {course.startDate} to {course.endDate}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(course.status)}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(course)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageFacilitator(course)}>
                          {course.facilitator === "Unassigned" ? (
                            <><UserPlus className="w-4 h-4 mr-2" /> Assign Facilitator</>
                          ) : (
                            <><UserMinus className="w-4 h-4 mr-2" /> Change Facilitator</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSuspendCourse(course.id)}>
                          {course.status === "Suspended" ? (
                            <><Play className="w-4 h-4 mr-2" /> Activate</>
                          ) : (
                            <><Ban className="w-4 h-4 mr-2" /> Suspend</>
                          )}
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => handleDeleteCourse(course.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="p-8">
              <EmptyState
                icon={<BookX className="w-12 h-12 text-muted-foreground" />}
                title="No courses found"
                description={search ? "Try a different search term." : "No courses match the selected filters."}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFacilitatorDialogOpen} onOpenChange={setIsFacilitatorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Facilitator</DialogTitle>
            <DialogDescription>
              {managingCourseFacilitator?.facilitator === "Unassigned"
                ? "Assign a facilitator to this course"
                : "Change or remove the facilitator from this course"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <Input value={managingCourseFacilitator?.title || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facilitator-select">Facilitator</Label>
              <Select value={selectedFacilitator} onValueChange={setSelectedFacilitator}>
                <SelectTrigger id="facilitator-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFacilitators.map(f => (
                    <SelectItem key={f.id ?? 'unassigned'} value={f.name}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFacilitatorDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignFacilitator}>
              {selectedFacilitator === "Unassigned" ? "Remove Facilitator" : "Assign Facilitator"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
