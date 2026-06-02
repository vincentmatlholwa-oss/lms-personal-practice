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
    const reviews = await prisma.courseReview.findMany({
      where,
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ reviews })
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
    const { userId, courseId, rating, comment } = body
    if (!userId || !courseId || !rating) {
      return NextResponse.json({ error: "userId, courseId, rating required" }, { status: 400 })
    }
    const review = await prisma.courseReview.create({
      data: { userId: Number(userId), courseId: Number(courseId), rating: Number(rating), comment: comment || "", createdAt: new Date().toISOString() },
    })
    return NextResponse.json({ review }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
