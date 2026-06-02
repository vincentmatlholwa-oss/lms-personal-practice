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
    const where: Record<string, number> = {}
    if (moduleId) where.moduleId = Number(moduleId)
    const lessons = await prisma.lesson.findMany({
      where,
      include: { activities: true },
      orderBy: { order: "asc" },
    })
    return NextResponse.json({ lessons })
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
    const { moduleId, title, content, order } = body
    if (!moduleId || !title) return NextResponse.json({ error: "moduleId and title required" }, { status: 400 })
    const lesson = await prisma.lesson.create({
      data: { moduleId: Number(moduleId), title, content: content || "", order: order || 1 },
    })
    return NextResponse.json({ lesson }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
