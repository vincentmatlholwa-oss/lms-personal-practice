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
    const lessonId = searchParams.get("lessonId")
    const where: Record<string, number> = {}
    if (lessonId) where.lessonId = Number(lessonId)
    const activities = await prisma.activity.findMany({ where, orderBy: { dueDate: "asc" } })
    return NextResponse.json({ activities })
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
    const { lessonId, title, description, type, dueDate, timeLimit } = body
    if (!lessonId || !title || !type) return NextResponse.json({ error: "lessonId, title, type required" }, { status: 400 })
    const activity = await prisma.activity.create({
      data: {
        lessonId: Number(lessonId), title, description: description || "", type,
        dueDate: dueDate || "", timeLimit: timeLimit || null,
      },
    })
    return NextResponse.json({ activity }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
