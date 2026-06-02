import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import path from "path"
import bcrypt from "bcryptjs"

const dbPath = path.resolve(process.cwd(), "dev.db")
const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10)

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@mdihub.com" },
    update: {},
    create: {
      firstName: "Admin", lastName: "User", email: "admin@mdihub.com",
      password: hash("admin123"), role: "Admin", status: "Active",
      phone: "0123456789", idNumber: "ID001",
    },
  })
  const john = await prisma.user.upsert({
    where: { email: "john@email.com" },
    update: {},
    create: {
      firstName: "John", lastName: "Doe", email: "john@email.com",
      password: hash("pass123"), role: "Student", status: "Active",
      phone: "0123456790", idNumber: "ID002",
    },
  })
  const jane = await prisma.user.upsert({
    where: { email: "jane@email.com" },
    update: {},
    create: {
      firstName: "Jane", lastName: "Smith", email: "jane@email.com",
      password: hash("pass123"), role: "Facilitator", status: "Pending",
      phone: "0123456791", idNumber: "ID003",
    },
  })
  const sarah = await prisma.user.upsert({
    where: { email: "sarah@email.com" },
    update: {},
    create: {
      firstName: "Sarah", lastName: "Johnson", email: "sarah@email.com",
      password: hash("pass123"), role: "Student", status: "Active",
      phone: "0123456792", idNumber: "ID004",
    },
  })
  const mike = await prisma.user.upsert({
    where: { email: "mike@email.com" },
    update: {},
    create: {
      firstName: "Mike", lastName: "Chen", email: "mike@email.com",
      password: hash("pass123"), role: "Facilitator", status: "Active",
      phone: "0123456793", idNumber: "ID005",
    },
  })
  const emily = await prisma.user.upsert({
    where: { email: "emily@email.com" },
    update: {},
    create: {
      firstName: "Emily", lastName: "Davis", email: "emily@email.com",
      password: hash("pass123"), role: "Student", status: "Active",
      phone: "0123456794", idNumber: "ID006",
    },
  })
  const david = await prisma.user.upsert({
    where: { email: "david@email.com" },
    update: {},
    create: {
      firstName: "David", lastName: "Wilson", email: "david@email.com",
      password: hash("pass123"), role: "Admin", status: "Active",
      phone: "0123456795", idNumber: "ID007",
    },
  })

  const mathCourse = await prisma.course.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, title: "Mathematics 101",
      description: "Introduction to algebra, geometry, and calculus fundamentals.",
      startDate: "2026-02-01", endDate: "2026-06-30",
      facilitatorId: jane.id, status: "Active",
    },
  })
  const csCourse = await prisma.course.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, title: "Computer Science Fundamentals",
      description: "Programming basics, data structures, and algorithms.",
      startDate: "2026-02-01", endDate: "2026-06-30",
      facilitatorId: mike.id, status: "Active",
    },
  })
  await prisma.course.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3, title: "Physics 101",
      description: "Classical mechanics, thermodynamics, and waves.",
      startDate: "2026-02-01", endDate: "2026-06-30",
      facilitatorId: null, status: "Active",
    },
  })
  await prisma.course.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4, title: "English Literature",
      description: "Study of classic and contemporary literary works.",
      startDate: "2026-02-01", endDate: "2026-06-30",
      facilitatorId: null, status: "Active",
    },
  })
  await prisma.course.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5, title: "Chemistry 101",
      description: "Atomic structure, chemical bonding, and reactions.",
      startDate: "2026-02-01", endDate: "2026-06-30",
      facilitatorId: null, status: "Suspended",
    },
  })

  await prisma.module.createMany({
    data: [
      { id: 1, courseId: 1, title: "Algebra Basics", description: "Linear equations, inequalities, and functions", order: 1 },
      { id: 2, courseId: 1, title: "Geometry", description: "Shapes, angles, and theorems", order: 2 },
      { id: 3, courseId: 1, title: "Calculus Introduction", description: "Limits, derivatives, and integrals", order: 3 },
      { id: 4, courseId: 2, title: "Programming Basics", description: "Variables, loops, and conditionals", order: 1 },
      { id: 5, courseId: 2, title: "Data Structures", description: "Arrays, linked lists, and trees", order: 2 },
      { id: 6, courseId: 2, title: "Algorithms", description: "Sorting, searching, and complexity", order: 3 },
      { id: 7, courseId: 3, title: "Mechanics", description: "Forces, motion, and energy", order: 1 },
      { id: 8, courseId: 3, title: "Thermodynamics", description: "Heat, work, and temperature", order: 2 },
    ],

  })

  await prisma.lesson.createMany({
    data: [
      { id: 1, moduleId: 1, title: "Linear Equations", content: "Solving linear equations in one variable...", resources: JSON.stringify([{ name: "Algebra_Notes.pdf", url: "#" }, { name: "Practice_Problems.pdf", url: "#" }]), order: 1 },
      { id: 2, moduleId: 1, title: "Inequalities", content: "Graphing and solving inequalities...", resources: JSON.stringify([{ name: "Inequalities_Guide.pdf", url: "#" }]), order: 2 },
      { id: 3, moduleId: 2, title: "Triangles", content: "Properties of triangles and congruence...", resources: "[]", order: 1 },
      { id: 4, moduleId: 4, title: "Variables and Data Types", content: "Understanding variables, integers, strings...", resources: JSON.stringify([{ name: "Python_Basics.pdf", url: "#" }]), order: 1 },
      { id: 5, moduleId: 4, title: "Control Flow", content: "If statements, loops, and conditionals...", resources: JSON.stringify([{ name: "Control_Flow.ipynb", url: "#" }]), order: 2 },
    ],

  })

  await prisma.activity.createMany({
    data: [
      { id: 1, lessonId: 1, title: "Algebra Quiz", description: "Complete the fundamentals quiz", type: "quiz", dueDate: "2026-06-15" },
      { id: 2, lessonId: 4, title: "Python Basics Quiz", description: "Test your Python knowledge", type: "quiz", dueDate: "2026-06-20" },
      { id: 3, lessonId: 3, title: "Geometry Test", description: "Comprehensive geometry test", type: "quiz", dueDate: "2026-06-25" },
    ],

  })

  const quiz1 = await prisma.quiz.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, activityId: 1, moduleId: 1,
      title: "Algebra Fundamentals Quiz",
      description: "Test your understanding of basic algebra concepts",
      dueDate: "2026-06-15", timeLimit: 30,
    },
  })
  const quiz2 = await prisma.quiz.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2, activityId: 2, moduleId: 4,
      title: "Python Basics Quiz",
      description: "Test your Python programming knowledge",
      dueDate: "2026-06-20", timeLimit: 20,
    },
  })

  await prisma.quizQuestion.createMany({
    data: [
      { id: 1, quizId: 1, question: "What is the value of x in 2x + 5 = 13?", answers: JSON.stringify(["3", "4", "5", "6", "7", "8"]), correctAnswer: 1, markAllocation: 5 },
      { id: 2, quizId: 1, question: "Solve: 3(x - 2) = 15", answers: JSON.stringify(["5", "6", "7", "8", "9", "10"]), correctAnswer: 2, markAllocation: 5 },
      { id: 3, quizId: 1, question: "What is the slope of y = 2x + 3?", answers: JSON.stringify(["1", "2", "3", "-2", "0", "undefined"]), correctAnswer: 1, markAllocation: 5 },
      { id: 4, quizId: 2, question: "What is the output of print(2**3)?", answers: JSON.stringify(["6", "8", "9", "5", "4", "10"]), correctAnswer: 1, markAllocation: 5 },
      { id: 5, quizId: 2, question: "Which of these is a valid variable name?", answers: JSON.stringify(["2var", "_var", "var-name", "var name", "var.name", "var$"]), correctAnswer: 1, markAllocation: 5 },
    ],

  })

  await prisma.test.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1, activityId: 3, moduleId: 2,
      title: "Geometry Test",
      description: "Comprehensive test on geometry concepts",
      dueDate: "2026-06-25", timeLimit: 60,
    },
  })
  await prisma.testQuestion.createMany({
    data: [
      { id: 1, testId: 1, question: "Explain the Pythagorean theorem and provide an example.", markAllocation: 10 },
      { id: 2, testId: 1, question: "Calculate the area of a circle with radius 7cm.", markAllocation: 10 },
    ],

  })

  await prisma.assignment.createMany({
    data: [
      { id: 1, moduleId: 1, courseId: 1, title: "Algebra Problem Set", description: "Complete problems 1-20 from chapter 3", dueDate: "2026-06-10", timeLimit: 120, attachments: JSON.stringify([{ name: "Problem_Set.pdf", url: "#" }]) },
      { id: 2, moduleId: 4, courseId: 2, title: "Python Programming Assignment", description: "Write a program that implements a calculator", dueDate: "2026-06-18", timeLimit: 180, attachments: JSON.stringify([{ name: "Assignment_Details.pdf", url: "#" }]) },
    ],

  })

  await prisma.gradebookEntry.createMany({
    data: [
      { id: 1, userId: john.id, courseId: 1, activityName: "Algebra Fundamentals Quiz", activityType: "Quiz", score: 12, total: 15, date: "2026-05-10" },
      { id: 2, userId: john.id, courseId: 1, activityName: "Algebra Problem Set", activityType: "Assignment", score: 85, total: 100, date: "2026-05-15" },
      { id: 3, userId: john.id, courseId: 2, activityName: "Python Basics Quiz", activityType: "Quiz", score: 8, total: 10, date: "2026-05-12" },
      { id: 4, userId: sarah.id, courseId: 1, activityName: "Algebra Fundamentals Quiz", activityType: "Quiz", score: 10, total: 15, date: "2026-05-10" },
      { id: 5, userId: sarah.id, courseId: 1, activityName: "Algebra Problem Set", activityType: "Assignment", score: 90, total: 100, date: "2026-05-15" },
    ],

  })

  await prisma.submission.createMany({
    data: [
      { id: 1, userId: john.id, activityId: 1, activityType: "quiz", content: JSON.stringify(["b", "c", "a"]), submittedAt: "2026-05-10T14:30:00", marks: 12, totalMarks: 15, graded: true, feedback: "Great work!", gradedAt: "2026-05-11T10:00:00", gradedBy: jane.id },
      { id: 2, userId: sarah.id, activityId: 1, activityType: "quiz", content: JSON.stringify(["a", "c", "b"]), submittedAt: "2026-05-10T15:00:00", marks: 10, totalMarks: 15, graded: true, gradedAt: "2026-05-11T10:30:00", gradedBy: jane.id },
    ],

  })

  await prisma.courseProgress.createMany({
    data: [
      { userId: john.id, courseId: 1, completedModuleIds: JSON.stringify([1]), completedLessonIds: JSON.stringify([1, 2]) },
      { userId: john.id, courseId: 2, completedModuleIds: "[]", completedLessonIds: "[]" },
      { userId: sarah.id, courseId: 1, completedModuleIds: JSON.stringify([1]), completedLessonIds: JSON.stringify([1]) },
    ],

  })

  await prisma.announcement.createMany({
    data: [
      { id: 1, title: "System Maintenance", description: "The LMS will be down for maintenance on June 1st.", date: "2026-05-20", priority: "High", authorId: adminUser.id, targetAudience: "All" },
      { id: 2, title: "New Course Available", description: "Machine Learning course is now open for enrollment.", date: "2026-05-18", priority: "Medium", authorId: adminUser.id, targetAudience: "Students" },
      { id: 3, title: "Exam Schedule", description: "Final exam schedule has been published.", date: "2026-05-15", priority: "High", authorId: adminUser.id, targetAudience: "All", attachment: JSON.stringify({ name: "Exam_Schedule.pdf", url: "#" }) },
      { id: 4, title: "Assignment Reminder", description: "Python assignment due this Friday.", date: "2026-05-14", priority: "Medium", authorId: jane.id, courseId: 2, targetAudience: "Students" },
    ],

  })

  await prisma.notification.createMany({
    data: [
      { id: 1, userId: john.id, title: "Quiz Graded", message: "Your Algebra quiz has been graded: 12/15", date: "2026-05-11T10:00:00", read: false, link: "/gradebook" },
      { id: 2, userId: john.id, title: "New Announcement", message: "Exam schedule has been published", date: "2026-05-15T09:00:00", read: false, link: "/announcements" },
      { id: 3, userId: john.id, title: "Assignment Due Soon", message: "Python assignment due in 2 days", date: "2026-05-16T08:00:00", read: true, link: "/courses/2" },
      { id: 4, userId: sarah.id, title: "Quiz Graded", message: "Your Algebra quiz has been graded: 10/15", date: "2026-05-11T10:30:00", read: false, link: "/gradebook" },
      { id: 5, userId: jane.id, title: "Application Pending", message: "Your facilitator application is pending approval", date: "2026-05-01T12:00:00", read: false },
    ],

  })

  await prisma.calendarEvent.createMany({
    data: [
      { id: 1, title: "Algebra Problem Set Due", date: "2026-06-10", type: "assignment", courseId: 1 },
      { id: 2, title: "Algebra Quiz", date: "2026-06-15", type: "quiz", courseId: 1 },
      { id: 3, title: "Python Assignment Due", date: "2026-06-18", type: "assignment", courseId: 2 },
      { id: 4, title: "Python Quiz", date: "2026-06-20", type: "quiz", courseId: 2 },
      { id: 5, title: "Geometry Test", date: "2026-06-25", type: "test", courseId: 1 },
      { id: 6, title: "Math Final Exam", date: "2026-06-28", type: "exam", courseId: 1 },
    ],

  })

  await prisma.discussion.createMany({
    data: [
      { id: 1, courseId: 1, moduleId: 1, userId: john.id, title: "Question about linear equations", content: "Can someone explain how to solve 3x + 7 = 22?", createdAt: "2026-05-12T10:00:00", pinned: false, resolved: true },
      { id: 2, courseId: 1, userId: mike.id, title: "Office hours this week", content: "I'll be holding extra office hours on Friday.", createdAt: "2026-05-13T14:00:00", pinned: true, resolved: false },
    ],

  })

  await prisma.discussionReply.createMany({
    data: [
      { id: 1, discussionId: 1, userId: mike.id, content: "Subtract 7 from both sides: 3x = 15, then divide by 3: x = 5", createdAt: "2026-05-12T11:00:00", attachments: "[]" },
      { id: 2, discussionId: 1, userId: john.id, content: "Thank you! That makes sense.", createdAt: "2026-05-12T11:30:00", attachments: "[]" },
    ],

  })

  await prisma.courseReview.createMany({
    data: [
      { id: 1, userId: john.id, courseId: 1, rating: 4, comment: "Great introductory course! The modules are well-structured.", createdAt: "2026-05-20T10:00:00" },
      { id: 2, userId: sarah.id, courseId: 1, rating: 5, comment: "Excellent teaching and resources.", createdAt: "2026-05-21T12:00:00" },
    ],

  })

  await prisma.enrollment.createMany({
    data: [
      { userId: john.id, courseId: 1 },
      { userId: john.id, courseId: 2 },
      { userId: sarah.id, courseId: 1 },
      { userId: emily.id, courseId: 2 },
    ],

  })

  await prisma.facilitatorApplication.createMany({
    data: [
      { id: 1, userId: jane.id, subject: "Mathematics", qualifications: "M.Ed in Mathematics", experience: "5 years teaching experience", date: "2026-04-15", status: "Pending" },
      { id: 2, userId: mike.id, subject: "Computer Science", qualifications: "M.Sc in Computer Science", experience: "3 years industry experience", date: "2026-04-10", status: "Approved" },
    ],

  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
