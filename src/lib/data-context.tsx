"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type {
  Course, Module, Quiz, Assignment, Announcement, FacilitatorApplication,
  GradebookEntry, Notification, CalendarEvent,
  Submission, Discussion, DiscussionReply, CourseReview, Certificate, CourseProgress,
  Lesson, Activity,
} from "./mock-data"
import {
  mockCourses as defaultCourses, mockModules as defaultModules,
  mockQuizzes as defaultQuizzes, mockAssignments as defaultAssignments,
  mockAnnouncements as defaultAnnouncements, mockGradebook as defaultGradebook,
  mockNotifications as defaultNotifications, mockCalendarEvents as defaultCalendarEvents,
  mockFacilitatorApplications as defaultApplications,
  mockSubmissions as defaultSubmissions,
  mockDiscussions as defaultDiscussions, mockDiscussionReplies as defaultDiscussionReplies,
  mockCourseReviews as defaultCourseReviews, mockCertificates as defaultCertificates,
  mockCourseProgress as defaultCourseProgress,
  mockEnrollments as defaultEnrollments,
  mockLessons as defaultLessons,
  mockActivities as defaultActivities,
} from "./mock-data"

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
  lessons: Lesson[]
  setLessons: (lessons: Lesson[]) => void
  activities: Activity[]
  setActivities: (activities: Activity[]) => void
  loading: boolean
}

const DataContext = createContext<DataContextType | null>(null)

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem("lms_token")
}

function getUserId(): number | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem("lms_user")
    if (!stored) return null
    return JSON.parse(stored).id as number
  } catch {
    return null
  }
}

async function apiGet<T>(url: string): Promise<T | null> {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCoursesState] = useState<Course[]>([...defaultCourses])
  const [modules, setModulesState] = useState<Module[]>([...defaultModules])
  const [quizzes, setQuizzesState] = useState<Quiz[]>([...defaultQuizzes])
  const [assignments, setAssignmentsState] = useState<Assignment[]>([...defaultAssignments])
  const [enrollments, setEnrollmentsState] = useState<{ userId: number; courseId: number }[]>([...defaultEnrollments])
  const [announcements, setAnnouncementsState] = useState<Announcement[]>([...defaultAnnouncements])
  const [gradebook, setGradebookState] = useState<GradebookEntry[]>([...defaultGradebook])
  const [notifications, setNotificationsState] = useState<Notification[]>([...defaultNotifications])
  const [calendarEvents, setCalendarEventsState] = useState<CalendarEvent[]>([...defaultCalendarEvents])
  const [facilitatorApplications, setFacilitatorApplicationsState] = useState<FacilitatorApplication[]>([...defaultApplications])
  const [submissions, setSubmissionsState] = useState<Submission[]>([...defaultSubmissions])
  const [discussions, setDiscussionsState] = useState<Discussion[]>([...defaultDiscussions])
  const [discussionReplies, setDiscussionRepliesState] = useState<DiscussionReply[]>([...defaultDiscussionReplies])
  const [courseReviews, setCourseReviewsState] = useState<CourseReview[]>([...defaultCourseReviews])
  const [certificates, setCertificatesState] = useState<Certificate[]>([...defaultCertificates])
  const [courseProgress, setCourseProgressState] = useState<CourseProgress[]>([...defaultCourseProgress])
  const [lessons, setLessonsState] = useState<Lesson[]>([...defaultLessons])
  const [activities, setActivitiesState] = useState<Activity[]>([...defaultActivities])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      const uid = getUserId()
      const [coursesRes, announcementsRes, enrollmentsRes, gradebookRes, notificationsRes, eventsRes, appsRes, submissionsRes, discussionsRes, reviewsRes, certsRes, progressRes, lessonsRes, activitiesRes] = await Promise.all([
        apiGet<{ courses: Course[] }>("/api/courses"),
        apiGet<{ announcements: Announcement[] }>("/api/announcements"),
        apiGet<{ enrollments: { userId: number; courseId: number }[] }>("/api/enrollments"),
        apiGet<{ gradebook: GradebookEntry[] }>("/api/gradebook"),
        apiGet<{ notifications: Notification[] }>(uid ? `/api/notifications?userId=${uid}` : "/api/notifications"),
        apiGet<{ events: CalendarEvent[] }>("/api/calendar-events"),
        apiGet<{ applications: FacilitatorApplication[] }>("/api/facilitator-applications"),
        apiGet<{ submissions: Submission[] }>("/api/submissions"),
        apiGet<{ discussions: Discussion[] }>("/api/discussions"),
        apiGet<{ reviews: CourseReview[] }>("/api/course-reviews"),
        apiGet<{ certificates: Certificate[] }>("/api/certificates"),
        apiGet<{ progress: CourseProgress[] }>("/api/course-progress"),
        apiGet<{ lessons: Lesson[] }>("/api/lessons"),
        apiGet<{ activities: Activity[] }>("/api/activities"),
      ])
      if (coursesRes?.courses) setCoursesState(coursesRes.courses)
      if (announcementsRes?.announcements) setAnnouncementsState(announcementsRes.announcements)
      if (enrollmentsRes?.enrollments) setEnrollmentsState(enrollmentsRes.enrollments)
      if (gradebookRes?.gradebook) setGradebookState(gradebookRes.gradebook)
      if (notificationsRes?.notifications) setNotificationsState(notificationsRes.notifications)
      if (eventsRes?.events) setCalendarEventsState(eventsRes.events)
      if (appsRes?.applications) setFacilitatorApplicationsState(appsRes.applications)
      if (submissionsRes?.submissions) setSubmissionsState(submissionsRes.submissions)
      if (discussionsRes?.discussions) setDiscussionsState(discussionsRes.discussions)
      if (reviewsRes?.reviews) setCourseReviewsState(reviewsRes.reviews)
      if (certsRes?.certificates) setCertificatesState(certsRes.certificates)
      if (progressRes?.progress) setCourseProgressState(progressRes.progress)
      if (lessonsRes?.lessons) setLessonsState(lessonsRes.lessons)
      if (activitiesRes?.activities) setActivitiesState(activitiesRes.activities)
      setLoading(false)
    }
    loadAll()
  }, [])

  const setCourses = useCallback((data: Course[]) => setCoursesState(data), [])
  const setModules = useCallback((data: Module[]) => setModulesState(data), [])
  const setQuizzes = useCallback((data: Quiz[]) => setQuizzesState(data), [])
  const setAssignments = useCallback((data: Assignment[]) => setAssignmentsState(data), [])
  const setEnrollments = useCallback((data: { userId: number; courseId: number }[]) => setEnrollmentsState(data), [])
  const setAnnouncements = useCallback((data: Announcement[]) => setAnnouncementsState(data), [])
  const setGradebook = useCallback((data: GradebookEntry[]) => setGradebookState(data), [])
  const setNotifications = useCallback((data: Notification[]) => setNotificationsState(data), [])
  const setCalendarEvents = useCallback((data: CalendarEvent[]) => setCalendarEventsState(data), [])
  const setFacilitatorApplications = useCallback((data: FacilitatorApplication[]) => setFacilitatorApplicationsState(data), [])
  const setSubmissions = useCallback((data: Submission[]) => setSubmissionsState(data), [])
  const setDiscussions = useCallback((data: Discussion[]) => setDiscussionsState(data), [])
  const setDiscussionReplies = useCallback((data: DiscussionReply[]) => setDiscussionRepliesState(data), [])
  const setCourseReviews = useCallback((data: CourseReview[]) => setCourseReviewsState(data), [])
  const setCertificates = useCallback((data: Certificate[]) => setCertificatesState(data), [])
  const setCourseProgress = useCallback((data: CourseProgress[]) => setCourseProgressState(data), [])
  const setLessons = useCallback((data: Lesson[]) => setLessonsState(data), [])
  const setActivities = useCallback((data: Activity[]) => setActivitiesState(data), [])

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
      courseProgress, setCourseProgress, lessons, setLessons, activities, setActivities, loading,
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
