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
    const courseId = searchParams.get("courseId")
    const where: Record<string, number> = {}
    if (userId) where.userId = Number(userId)
    if (courseId) where.courseId = Number(courseId)
    const certificates = await prisma.certificate.findMany({ where, orderBy: { issuedAt: "desc" } })
    return NextResponse.json({ certificates })
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
    const { userId, courseId, certificateId } = body
    if (!userId || !courseId || !certificateId) {
      return NextResponse.json({ error: "userId, courseId, certificateId required" }, { status: 400 })
    }
    const certificate = await prisma.certificate.create({
      data: {
        userId: Number(userId),
        courseId: Number(courseId),
        certificateId,
        issuedAt: new Date().toISOString(),
      },
    })
    return NextResponse.json({ certificate }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
