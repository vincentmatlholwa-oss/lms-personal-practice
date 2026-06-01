export type Role = "Student" | "Facilitator" | "Admin"
export type Status = "Active" | "Suspended" | "Pending"

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
  status: Status
  phone: string
  idNumber: string
  avatar?: string
}

export interface Course {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  facilitatorId: number | null
  status: "Active" | "Suspended"
}

export interface Module {
  id: number
  courseId: number
  title: string
  description: string
  order: number
}

export interface Lesson {
  id: number
  moduleId: number
  title: string
  content: string
  resources: { name: string; url: string }[]
  order: number
}

export interface Activity {
  id: number
  lessonId: number
  title: string
  description: string
  type: "quiz" | "assignment" | "reading"
  dueDate: string
  timeLimit?: number
}

export interface Quiz {
  id: number
  activityId: number
  moduleId: number
  title: string
  description: string
  dueDate: string
  timeLimit: number
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
  markAllocation: number
}

export interface Test {
  id: number
  activityId: number
  moduleId: number
  title: string
  description: string
  dueDate: string
  timeLimit: number
  questions: TestQuestion[]
}

export interface TestQuestion {
  id: number
  question: string
  markAllocation: number
}

export interface Assignment {
  id: number
  moduleId: number
  courseId: number
  title: string
  description: string
  dueDate: string
  timeLimit?: number
  attachments: { name: string; url: string }[]
}

export interface GradebookEntry {
  id: number
  userId: number
  courseId: number
  activityName: string
  activityType: "Activity" | "Quiz" | "Test" | "Assignment" | "Exam"
  score: number
  total: number
  date: string
}

export interface Submission {
  id: number
  userId: number
  activityId: number
  activityType: "quiz" | "assignment"
  content: string
  submittedAt: string
  marks?: number
  totalMarks?: number
  graded: boolean
  feedback?: string
  gradedAt?: string
  gradedBy?: number
  resubmissionAllowed?: boolean
}

export interface Announcement {
  id: number
  title: string
  description: string
  date: string
  priority: "High" | "Medium" | "Low"
  attachment?: { name: string; url: string }
  image?: string
  authorId: number
  courseId?: number
  targetAudience: "All" | "Students" | "Facilitators" | "Admins"
}

export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  date: string
  read: boolean
  link?: string
}

export interface CalendarEvent {
  id: number
  title: string
  date: string
  type: "exam" | "assignment" | "quiz" | "test" | "event"
  courseId?: number
}

export interface CourseProgress {
  userId: number
  courseId: number
  completedModuleIds: number[]
  completedLessonIds: number[]
  completedAt?: string
}

export interface Discussion {
  id: number
  courseId: number
  moduleId?: number
  lessonId?: number
  userId: number
  title: string
  content: string
  createdAt: string
  pinned: boolean
  resolved: boolean
}

export interface DiscussionReply {
  id: number
  discussionId: number
  userId: number
  content: string
  createdAt: string
  attachments: { name: string; url: string }[]
}

export interface CourseReview {
  id: number
  userId: number
  courseId: number
  rating: number
  comment: string
  createdAt: string
}

export interface Certificate {
  id: number
  userId: number
  courseId: number
  issuedAt: string
  certificateId: string
}

export interface FacilitatorApplication {
  id: number
  userId: number
  subject: string
  qualifications: string
  experience: string
  date: string
  status: "Pending" | "Approved" | "Declined"
}

function persistArray<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return
  try { localStorage.setItem("lms_" + key, JSON.stringify(data)) } catch {}
}

function loadArray<T>(key: string, defaults: T[]): T[] {
  if (typeof window === "undefined") return [...defaults]
  try {
    const stored = localStorage.getItem("lms_" + key)
    if (stored) return JSON.parse(stored)
  } catch {}
  return [...defaults]
}

function makePersistent<T>(key: string, defaults: T[]): T[] {
  const arr = loadArray(key, defaults)
  const persist = () => persistArray(key, arr)
  const mutatingMethods = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"] as const
  for (const method of mutatingMethods) {
    const arrAny = arr as unknown as Record<string, (...args: unknown[]) => unknown>
    const original = arrAny[method]
    arrAny[method] = (...args: unknown[]) => {
      const result = original.apply(arr, args)
      persist()
      return result
    }
  }
  return arr
}

export const mockUsers: User[] = makePersistent("users", [
  { id: 1, firstName: "Admin", lastName: "User", email: "admin@mdihub.com", password: "admin123", role: "Admin", status: "Active", phone: "0123456789", idNumber: "ID001" },
  { id: 2, firstName: "John", lastName: "Doe", email: "john@email.com", password: "pass123", role: "Student", status: "Active", phone: "0123456790", idNumber: "ID002" },
  { id: 3, firstName: "Jane", lastName: "Smith", email: "jane@email.com", password: "pass123", role: "Facilitator", status: "Pending", phone: "0123456791", idNumber: "ID003" },
  { id: 4, firstName: "Sarah", lastName: "Johnson", email: "sarah@email.com", password: "pass123", role: "Student", status: "Active", phone: "0123456792", idNumber: "ID004" },
  { id: 5, firstName: "Mike", lastName: "Chen", email: "mike@email.com", password: "pass123", role: "Facilitator", status: "Active", phone: "0123456793", idNumber: "ID005" },
  { id: 6, firstName: "Emily", lastName: "Davis", email: "emily@email.com", password: "pass123", role: "Student", status: "Active", phone: "0123456794", idNumber: "ID006" },
  { id: 7, firstName: "David", lastName: "Wilson", email: "david@email.com", password: "pass123", role: "Admin", status: "Active", phone: "0123456795", idNumber: "ID007" },
])

export const mockCourses: Course[] = makePersistent("courses", [
  { id: 1, title: "Mathematics 101", description: "Introduction to algebra, geometry, and calculus fundamentals.", startDate: "2026-02-01", endDate: "2026-06-30", facilitatorId: 3, status: "Active" },
  { id: 2, title: "Computer Science Fundamentals", description: "Programming basics, data structures, and algorithms.", startDate: "2026-02-01", endDate: "2026-06-30", facilitatorId: 5, status: "Active" },
  { id: 3, title: "Physics 101", description: "Classical mechanics, thermodynamics, and waves.", startDate: "2026-02-01", endDate: "2026-06-30", facilitatorId: null, status: "Active" },
  { id: 4, title: "English Literature", description: "Study of classic and contemporary literary works.", startDate: "2026-02-01", endDate: "2026-06-30", facilitatorId: null, status: "Active" },
  { id: 5, title: "Chemistry 101", description: "Atomic structure, chemical bonding, and reactions.", startDate: "2026-02-01", endDate: "2026-06-30", facilitatorId: null, status: "Suspended" },
])

export const mockModules: Module[] = makePersistent("modules", [
  { id: 1, courseId: 1, title: "Algebra Basics", description: "Linear equations, inequalities, and functions", order: 1 },
  { id: 2, courseId: 1, title: "Geometry", description: "Shapes, angles, and theorems", order: 2 },
  { id: 3, courseId: 1, title: "Calculus Introduction", description: "Limits, derivatives, and integrals", order: 3 },
  { id: 4, courseId: 2, title: "Programming Basics", description: "Variables, loops, and conditionals", order: 1 },
  { id: 5, courseId: 2, title: "Data Structures", description: "Arrays, linked lists, and trees", order: 2 },
  { id: 6, courseId: 2, title: "Algorithms", description: "Sorting, searching, and complexity", order: 3 },
  { id: 7, courseId: 3, title: "Mechanics", description: "Forces, motion, and energy", order: 1 },
  { id: 8, courseId: 3, title: "Thermodynamics", description: "Heat, work, and temperature", order: 2 },
])

export const mockLessons: Lesson[] = makePersistent("lessons", [
  { id: 1, moduleId: 1, title: "Linear Equations", content: "Solving linear equations in one variable...", resources: [{ name: "Algebra_Notes.pdf", url: "#" }, { name: "Practice_Problems.pdf", url: "#" }], order: 1 },
  { id: 2, moduleId: 1, title: "Inequalities", content: "Graphing and solving inequalities...", resources: [{ name: "Inequalities_Guide.pdf", url: "#" }], order: 2 },
  { id: 3, moduleId: 2, title: "Triangles", content: "Properties of triangles and congruence...", resources: [], order: 1 },
  { id: 4, moduleId: 4, title: "Variables and Data Types", content: "Understanding variables, integers, strings...", resources: [{ name: "Python_Basics.pdf", url: "#" }], order: 1 },
  { id: 5, moduleId: 4, title: "Control Flow", content: "If statements, loops, and conditionals...", resources: [{ name: "Control_Flow.ipynb", url: "#" }], order: 2 },
])

export const mockQuizzes: Quiz[] = makePersistent("quizzes", [
  {
    id: 1, activityId: 1, moduleId: 1,
    title: "Algebra Fundamentals Quiz",
    description: "Test your understanding of basic algebra concepts",
    dueDate: "2026-06-15", timeLimit: 30,
    questions: [
      { id: 1, question: "What is the value of x in 2x + 5 = 13?", answers: ["3", "4", "5", "6", "7", "8"], correctAnswer: 1, markAllocation: 5 },
      { id: 2, question: "Solve: 3(x - 2) = 15", answers: ["5", "6", "7", "8", "9", "10"], correctAnswer: 2, markAllocation: 5 },
      { id: 3, question: "What is the slope of y = 2x + 3?", answers: ["1", "2", "3", "-2", "0", "undefined"], correctAnswer: 1, markAllocation: 5 },
    ],
  },
  {
    id: 2, activityId: 2, moduleId: 4,
    title: "Python Basics Quiz",
    description: "Test your Python programming knowledge",
    dueDate: "2026-06-20", timeLimit: 20,
    questions: [
      { id: 4, question: "What is the output of print(2**3)?", answers: ["6", "8", "9", "5", "4", "10"], correctAnswer: 1, markAllocation: 5 },
      { id: 5, question: "Which of these is a valid variable name?", answers: ["2var", "_var", "var-name", "var name", "var.name", "var$"], correctAnswer: 1, markAllocation: 5 },
    ],
  },
])

export const mockTests: Test[] = makePersistent("tests", [
  {
    id: 1, activityId: 3, moduleId: 2,
    title: "Geometry Test",
    description: "Comprehensive test on geometry concepts",
    dueDate: "2026-06-25", timeLimit: 60,
    questions: [
      { id: 1, question: "Explain the Pythagorean theorem and provide an example.", markAllocation: 10 },
      { id: 2, question: "Calculate the area of a circle with radius 7cm.", markAllocation: 10 },
    ],
  },
])

export const mockAssignments: Assignment[] = makePersistent("assignments", [
  { id: 1, moduleId: 1, courseId: 1, title: "Algebra Problem Set", description: "Complete problems 1-20 from chapter 3", dueDate: "2026-06-10", timeLimit: 120, attachments: [{ name: "Problem_Set.pdf", url: "#" }] },
  { id: 2, moduleId: 4, courseId: 2, title: "Python Programming Assignment", description: "Write a program that implements a calculator", dueDate: "2026-06-18", timeLimit: 180, attachments: [{ name: "Assignment_Details.pdf", url: "#" }] },
])

export const mockGradebook: GradebookEntry[] = makePersistent("gradebook", [
  { id: 1, userId: 2, courseId: 1, activityName: "Algebra Fundamentals Quiz", activityType: "Quiz", score: 12, total: 15, date: "2026-05-10" },
  { id: 2, userId: 2, courseId: 1, activityName: "Algebra Problem Set", activityType: "Assignment", score: 85, total: 100, date: "2026-05-15" },
  { id: 3, userId: 2, courseId: 2, activityName: "Python Basics Quiz", activityType: "Quiz", score: 8, total: 10, date: "2026-05-12" },
  { id: 4, userId: 4, courseId: 1, activityName: "Algebra Fundamentals Quiz", activityType: "Quiz", score: 10, total: 15, date: "2026-05-10" },
  { id: 5, userId: 4, courseId: 1, activityName: "Algebra Problem Set", activityType: "Assignment", score: 90, total: 100, date: "2026-05-15" },
])

export const mockSubmissions: Submission[] = makePersistent("submissions", [
  { id: 1, userId: 2, activityId: 1, activityType: "quiz", content: "[\"b\",\"c\",\"a\"]", submittedAt: "2026-05-10T14:30:00", marks: 12, totalMarks: 15, graded: true, feedback: "Great work!", gradedAt: "2026-05-11T10:00:00", gradedBy: 3 },
  { id: 2, userId: 4, activityId: 1, activityType: "quiz", content: "[\"a\",\"c\",\"b\"]", submittedAt: "2026-05-10T15:00:00", marks: 10, totalMarks: 15, graded: true, gradedAt: "2026-05-11T10:30:00", gradedBy: 3 },
])

export const mockCourseProgress: CourseProgress[] = makePersistent("courseProgress", [
  { userId: 2, courseId: 1, completedModuleIds: [1], completedLessonIds: [1, 2] },
  { userId: 2, courseId: 2, completedModuleIds: [], completedLessonIds: [] },
  { userId: 4, courseId: 1, completedModuleIds: [1], completedLessonIds: [1] },
])

export const mockDiscussions: Discussion[] = makePersistent("discussions", [
  { id: 1, courseId: 1, moduleId: 1, userId: 2, title: "Question about linear equations", content: "Can someone explain how to solve 3x + 7 = 22?", createdAt: "2026-05-12T10:00:00", pinned: false, resolved: true },
  { id: 2, courseId: 1, userId: 5, title: "Office hours this week", content: "I'll be holding extra office hours on Friday.", createdAt: "2026-05-13T14:00:00", pinned: true, resolved: false },
])

export const mockDiscussionReplies: DiscussionReply[] = makePersistent("discussionReplies", [
  { id: 1, discussionId: 1, userId: 5, content: "Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5", createdAt: "2026-05-12T11:00:00", attachments: [] },
  { id: 2, discussionId: 1, userId: 2, content: "Thank you! That makes sense.", createdAt: "2026-05-12T11:30:00", attachments: [] },
])

export const mockCourseReviews: CourseReview[] = makePersistent("courseReviews", [
  { id: 1, userId: 2, courseId: 1, rating: 4, comment: "Great introductory course! The modules are well-structured.", createdAt: "2026-05-20T10:00:00" },
  { id: 2, userId: 4, courseId: 1, rating: 5, comment: "Excellent teaching and resources.", createdAt: "2026-05-21T12:00:00" },
])

export const mockCertificates: Certificate[] = makePersistent("certificates", [])

export const mockAnnouncements: Announcement[] = makePersistent("announcements", [
  { id: 1, title: "System Maintenance", description: "The LMS will be down for maintenance on June 1st.", date: "2026-05-20", priority: "High", authorId: 1, targetAudience: "All" },
  { id: 2, title: "New Course Available", description: "Machine Learning course is now open for enrollment.", date: "2026-05-18", priority: "Medium", authorId: 1, targetAudience: "Students" },
  { id: 3, title: "Exam Schedule", description: "Final exam schedule has been published.", date: "2026-05-15", priority: "High", authorId: 1, targetAudience: "All", attachment: { name: "Exam_Schedule.pdf", url: "#" } },
  { id: 4, title: "Assignment Reminder", description: "Python assignment due this Friday.", date: "2026-05-14", priority: "Medium", authorId: 3, courseId: 2, targetAudience: "Students" },
])

export const mockNotifications: Notification[] = makePersistent("notifications", [
  { id: 1, userId: 2, title: "Quiz Graded", message: "Your Algebra quiz has been graded: 12/15", date: "2026-05-11T10:00:00", read: false, link: "/gradebook" },
  { id: 2, userId: 2, title: "New Announcement", message: "Exam schedule has been published", date: "2026-05-15T09:00:00", read: false, link: "/announcements" },
  { id: 3, userId: 2, title: "Assignment Due Soon", message: "Python assignment due in 2 days", date: "2026-05-16T08:00:00", read: true, link: "/courses/2" },
  { id: 4, userId: 4, title: "Quiz Graded", message: "Your Algebra quiz has been graded: 10/15", date: "2026-05-11T10:30:00", read: false, link: "/gradebook" },
  { id: 5, userId: 3, title: "Application Pending", message: "Your facilitator application is pending approval", date: "2026-05-01T12:00:00", read: false },
])

export const mockCalendarEvents: CalendarEvent[] = makePersistent("calendarEvents", [
  { id: 1, title: "Algebra Problem Set Due", date: "2026-06-10", type: "assignment", courseId: 1 },
  { id: 2, title: "Algebra Quiz", date: "2026-06-15", type: "quiz", courseId: 1 },
  { id: 3, title: "Python Assignment Due", date: "2026-06-18", type: "assignment", courseId: 2 },
  { id: 4, title: "Python Quiz", date: "2026-06-20", type: "quiz", courseId: 2 },
  { id: 5, title: "Geometry Test", date: "2026-06-25", type: "test", courseId: 1 },
  { id: 6, title: "Math Final Exam", date: "2026-06-28", type: "exam", courseId: 1 },
])

export const mockFacilitatorApplications: FacilitatorApplication[] = makePersistent("facilitatorApplications", [
  { id: 1, userId: 3, subject: "Mathematics", qualifications: "M.Ed in Mathematics", experience: "5 years teaching experience", date: "2026-04-15", status: "Pending" },
  { id: 2, userId: 5, subject: "Computer Science", qualifications: "M.Sc in Computer Science", experience: "3 years industry experience", date: "2026-04-10", status: "Approved" },
])

export const mockEnrollments: { userId: number; courseId: number }[] = makePersistent("enrollments", [
  { userId: 2, courseId: 1 },
  { userId: 2, courseId: 2 },
  { userId: 4, courseId: 1 },
  { userId: 6, courseId: 2 },
])

export const mockActivities: Activity[] = makePersistent("activities", [
  { id: 1, lessonId: 1, title: "Algebra Quiz", description: "Complete the fundamentals quiz", type: "quiz", dueDate: "2026-06-15" },
  { id: 2, lessonId: 4, title: "Python Basics Quiz", description: "Test your Python knowledge", type: "quiz", dueDate: "2026-06-20" },
  { id: 3, lessonId: 3, title: "Geometry Test", description: "Comprehensive geometry test", type: "quiz", dueDate: "2026-06-25" },
])
