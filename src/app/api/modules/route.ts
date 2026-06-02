import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    if (!courseId) {
      return NextResponse.json({ error: "courseId query parameter required" }, { status: 400 })
    }
    const modules = await prisma.module.findMany({
      where: { courseId: Number(courseId) },
      include: {
        lessons: true,
        quizzes: true,
        assignments: true,
      },
      orderBy: { order: "asc" },
    })
    return NextResponse.json({ modules })
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
    const { courseId, title, description, order } = body
    if (!courseId || !title) return NextResponse.json({ error: "courseId and title required" }, { status: 400 })
    const mod = await prisma.module.create({
      data: { courseId: Number(courseId), title, description: description || "", order: order || 1 },
    })
    return NextResponse.json({ module: mod }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
