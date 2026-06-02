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
    const activityId = searchParams.get("activityId")
    const activityType = searchParams.get("activityType")
    const where: Record<string, string | number> = {}
    if (userId) where.userId = Number(userId)
    if (activityId) where.activityId = Number(activityId)
    if (activityType) where.activityType = activityType
    const submissions = await prisma.submission.findMany({ where, orderBy: { submittedAt: "desc" } })
    return NextResponse.json({ submissions })
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
    const { userId, activityId, activityType, content } = body
    if (!userId || !activityId || !activityType || !content) {
      return NextResponse.json({ error: "userId, activityId, activityType, content required" }, { status: 400 })
    }
    const submission = await prisma.submission.create({
      data: {
        userId: Number(userId),
        activityId: Number(activityId),
        activityType,
        content: typeof content === "string" ? content : JSON.stringify(content),
        submittedAt: new Date().toISOString(),
      },
    })
    return NextResponse.json({ submission }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
