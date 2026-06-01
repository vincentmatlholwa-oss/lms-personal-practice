"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
  type Course, type Module, type Quiz, type Assignment, type Announcement, type FacilitatorApplication,
  type GradebookEntry, type Notification, type CalendarEvent,
  type Submission, type Discussion, type DiscussionReply, type CourseReview, type Certificate, type CourseProgress,
  mockCourses as defaultCourses, mockModules as defaultModules,
  mockQuizzes as defaultQuizzes, mockAssignments as defaultAssignments,
  mockAnnouncements as defaultAnnouncements, mockGradebook as defaultGradebook,
  mockNotifications as defaultNotifications, mockCalendarEvents as defaultCalendarEvents,
  mockFacilitatorApplications as defaultApplications,
  mockSubmissions as defaultSubmissions,
  mockDiscussions as defaultDiscussions, mockDiscussionReplies as defaultDiscussionReplies,
  mockCourseReviews as defaultCourseReviews, mockCertificates as defaultCertificates,
  mockCourseProgress as defaultCourseProgress,
} from "./mock-data"

const STORAGE_PREFIX = "lms_data_"

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
  } catch {}
}

interface DataContextType {
  courses: Course[]
  setCourses: (courses: Course[]) => void
  modules: Module[]
  setModules: (modules: Module[]) => void
  quizzes: Quiz[]
  setQuizzes: (quizzes: Quiz[]) => void
  assignments: Assignment[]
  setAssignments: (assignments: Assignment[]) => void
  enrollments: { userId: number; courseId: number }[]
  setEnrollments: (enrollments: { userId: number; courseId: number }[]) => void
  announcements: Announcement[]
  setAnnouncements: (announcements: Announcement[]) => void
  gradebook: GradebookEntry[]
  setGradebook: (gradebook: GradebookEntry[]) => void
  notifications: Notification[]
  setNotifications: (notifications: Notification[]) => void
  calendarEvents: CalendarEvent[]
  setCalendarEvents: (events: CalendarEvent[]) => void
  facilitatorApplications: FacilitatorApplication[]
  setFacilitatorApplications: (apps: FacilitatorApplication[]) => void
  submissions: Submission[]
  setSubmissions: (submissions: Submission[]) => void
  discussions: Discussion[]
  setDiscussions: (discussions: Discussion[]) => void
  discussionReplies: DiscussionReply[]
  setDiscussionReplies: (replies: DiscussionReply[]) => void
  courseReviews: CourseReview[]
  setCourseReviews: (reviews: CourseReview[]) => void
  certificates: Certificate[]
  setCertificates: (certs: Certificate[]) => void
  courseProgress: CourseProgress[]
  setCourseProgress: (progress: CourseProgress[]) => void
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCoursesState] = useState<Course[]>(() => loadFromStorage("courses", defaultCourses))
  const [modules, setModulesState] = useState<Module[]>(() => loadFromStorage("modules", defaultModules))
  const [quizzes, setQuizzesState] = useState<Quiz[]>(() => loadFromStorage("quizzes", defaultQuizzes))
  const [assignments, setAssignmentsState] = useState<Assignment[]>(() => loadFromStorage("assignments", defaultAssignments))
  const [enrollments, setEnrollmentsState] = useState<{ userId: number; courseId: number }[]>(() => loadFromStorage("enrollments", []))
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(() => loadFromStorage("announcements", defaultAnnouncements))
  const [gradebook, setGradebookState] = useState<GradebookEntry[]>(() => loadFromStorage("gradebook", defaultGradebook))
  const [notifications, setNotificationsState] = useState<Notification[]>(() => loadFromStorage("notifications", defaultNotifications))
  const [calendarEvents, setCalendarEventsState] = useState<CalendarEvent[]>(() => loadFromStorage("calendarEvents", defaultCalendarEvents))
  const [facilitatorApplications, setFacilitatorApplicationsState] = useState<FacilitatorApplication[]>(() => loadFromStorage("facilitatorApplications", defaultApplications))
  const [submissions, setSubmissionsState] = useState<Submission[]>(() => loadFromStorage("submissions", defaultSubmissions))
  const [discussions, setDiscussionsState] = useState<Discussion[]>(() => loadFromStorage("discussions", defaultDiscussions))
  const [discussionReplies, setDiscussionRepliesState] = useState<DiscussionReply[]>(() => loadFromStorage("discussionReplies", defaultDiscussionReplies))
  const [courseReviews, setCourseReviewsState] = useState<CourseReview[]>(() => loadFromStorage("courseReviews", defaultCourseReviews))
  const [certificates, setCertificatesState] = useState<Certificate[]>(() => loadFromStorage("certificates", defaultCertificates))
  const [courseProgress, setCourseProgressState] = useState<CourseProgress[]>(() => loadFromStorage("courseProgress", defaultCourseProgress))

  const setCourses = useCallback((data: Course[]) => { setCoursesState(data); saveToStorage("courses", data) }, [])
  const setModules = useCallback((data: Module[]) => { setModulesState(data); saveToStorage("modules", data) }, [])
  const setQuizzes = useCallback((data: Quiz[]) => { setQuizzesState(data); saveToStorage("quizzes", data) }, [])
  const setAssignments = useCallback((data: Assignment[]) => { setAssignmentsState(data); saveToStorage("assignments", data) }, [])
  const setEnrollments = useCallback((data: { userId: number; courseId: number }[]) => { setEnrollmentsState(data); saveToStorage("enrollments", data) }, [])
  const setAnnouncements = useCallback((data: Announcement[]) => { setAnnouncementsState(data); saveToStorage("announcements", data) }, [])
  const setGradebook = useCallback((data: GradebookEntry[]) => { setGradebookState(data); saveToStorage("gradebook", data) }, [])
  const setNotifications = useCallback((data: Notification[]) => { setNotificationsState(data); saveToStorage("notifications", data) }, [])
  const setCalendarEvents = useCallback((data: CalendarEvent[]) => { setCalendarEventsState(data); saveToStorage("calendarEvents", data) }, [])
  const setFacilitatorApplications = useCallback((data: FacilitatorApplication[]) => { setFacilitatorApplicationsState(data); saveToStorage("facilitatorApplications", data) }, [])
  const setSubmissions = useCallback((data: Submission[]) => { setSubmissionsState(data); saveToStorage("submissions", data) }, [])
  const setDiscussions = useCallback((data: Discussion[]) => { setDiscussionsState(data); saveToStorage("discussions", data) }, [])
  const setDiscussionReplies = useCallback((data: DiscussionReply[]) => { setDiscussionRepliesState(data); saveToStorage("discussionReplies", data) }, [])
  const setCourseReviews = useCallback((data: CourseReview[]) => { setCourseReviewsState(data); saveToStorage("courseReviews", data) }, [])
  const setCertificates = useCallback((data: Certificate[]) => { setCertificatesState(data); saveToStorage("certificates", data) }, [])
  const setCourseProgress = useCallback((data: CourseProgress[]) => { setCourseProgressState(data); saveToStorage("courseProgress", data) }, [])

  return (
    <DataContext.Provider value={{
      courses, setCourses, modules, setModules, quizzes, setQuizzes,
      assignments, setAssignments, enrollments, setEnrollments,
      announcements, setAnnouncements, gradebook, setGradebook,
      notifications, setNotifications, calendarEvents, setCalendarEvents,
      facilitatorApplications, setFacilitatorApplications,
      submissions, setSubmissions,
      discussions, setDiscussions, discussionReplies, setDiscussionReplies,
      courseReviews, setCourseReviews, certificates, setCertificates,
      courseProgress, setCourseProgress,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}
