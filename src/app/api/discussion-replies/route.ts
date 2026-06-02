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
    const discussionId = searchParams.get("discussionId")
    if (!discussionId) return NextResponse.json({ error: "discussionId query parameter required" }, { status: 400 })
    const replies = await prisma.discussionReply.findMany({
      where: { discussionId: Number(discussionId) },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json({ replies })
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
    const { discussionId, userId, content } = body
    if (!discussionId || !userId || !content) {
      return NextResponse.json({ error: "discussionId, userId, content required" }, { status: 400 })
    }
    const reply = await prisma.discussionReply.create({
      data: { discussionId: Number(discussionId), userId: Number(userId), content, createdAt: new Date().toISOString() },
    })
    return NextResponse.json({ reply }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
