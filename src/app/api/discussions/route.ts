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
    const discussions = await prisma.discussion.findMany({
      where,
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } }, replies: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ discussions })
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
    const { courseId, userId, title, content } = body
    if (!courseId || !userId || !title || !content) {
      return NextResponse.json({ error: "courseId, userId, title, content required" }, { status: 400 })
    }
    const discussion = await prisma.discussion.create({
      data: { courseId: Number(courseId), userId: Number(userId), title, content, createdAt: new Date().toISOString() },
    })
    return NextResponse.json({ discussion }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
