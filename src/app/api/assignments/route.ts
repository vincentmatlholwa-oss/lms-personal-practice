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
    const moduleId = searchParams.get("moduleId")
    const courseId = searchParams.get("courseId")
    const where: Record<string, number> = {}
    if (moduleId) where.moduleId = Number(moduleId)
    if (courseId) where.courseId = Number(courseId)
    const assignments = await prisma.assignment.findMany({ where, orderBy: { dueDate: "asc" } })
    return NextResponse.json({ assignments })
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
    const { moduleId, courseId, title, description, dueDate, timeLimit } = body
    if (!moduleId || !courseId || !title) {
      return NextResponse.json({ error: "moduleId, courseId, title required" }, { status: 400 })
    }
    const assignment = await prisma.assignment.create({
      data: {
        moduleId: Number(moduleId),
        courseId: Number(courseId),
        title,
        description: description || "",
        dueDate: dueDate || "",
        timeLimit: timeLimit || null,
      },
    })
    return NextResponse.json({ assignment }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
