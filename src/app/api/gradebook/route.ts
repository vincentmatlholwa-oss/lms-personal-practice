import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const courseId = searchParams.get("courseId")
    const where: Record<string, number> = {}
    if (userId) where.userId = Number(userId)
    if (courseId) where.courseId = Number(courseId)
    const gradebook = await prisma.gradebookEntry.findMany({ where, orderBy: { date: "desc" } })
    return NextResponse.json({ gradebook })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const body = await request.json()
    const { userId, courseId, activityName, activityType, score, total, date } = body
    if (!userId || !courseId || !activityName || !activityType || score === undefined || total === undefined) {
      return NextResponse.json({ error: "userId, courseId, activityName, activityType, score, total required" }, { status: 400 })
    }
    const entry = await prisma.gradebookEntry.create({
      data: {
        userId: Number(userId),
        courseId: Number(courseId),
        activityName,
        activityType,
        score: Number(score),
        total: Number(total),
        date: date || new Date().toISOString().split("T")[0],
      },
    })
    return NextResponse.json({ entry }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
