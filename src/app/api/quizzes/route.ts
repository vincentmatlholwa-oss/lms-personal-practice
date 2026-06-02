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
    if (!moduleId) return NextResponse.json({ error: "moduleId query parameter required" }, { status: 400 })
    const quizzes = await prisma.quiz.findMany({
      where: { moduleId: Number(moduleId) },
      include: { questions: true },
    })
    return NextResponse.json({ quizzes })
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
    const { moduleId, title, description, dueDate, timeLimit } = body
    if (!moduleId || !title) return NextResponse.json({ error: "moduleId and title required" }, { status: 400 })
    const quiz = await prisma.quiz.create({ data: { moduleId: Number(moduleId), title, description: description || "", dueDate: dueDate || "", timeLimit: timeLimit || 30 } })
    return NextResponse.json({ quiz }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
