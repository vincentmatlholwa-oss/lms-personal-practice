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
    const courseId = searchParams.get("courseId")
    const where: Record<string, number> = {}
    if (courseId) where.courseId = Number(courseId)
    const events = await prisma.calendarEvent.findMany({ where, orderBy: { date: "asc" } })
    return NextResponse.json({ events })
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
    const { title, date, type, courseId } = body
    if (!title || !date || !type) return NextResponse.json({ error: "title, date, type required" }, { status: 400 })
    const event = await prisma.calendarEvent.create({
      data: { title, date, type, courseId: courseId ? Number(courseId) : null },
    })
    return NextResponse.json({ event }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
