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
    const targetAudience = searchParams.get("targetAudience")
    const where = targetAudience ? { targetAudience } : {}
    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        course: true,
      },
      orderBy: { id: "desc" },
    })
    return NextResponse.json({ announcements })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { title, description, authorId, priority, attachment, image, courseId, targetAudience } = body
    if (!title || !description || !authorId) {
      return NextResponse.json({ error: "title, description, and authorId required" }, { status: 400 })
    }
    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        authorId: Number(authorId),
        date: new Date().toISOString().split("T")[0],
        priority: priority || "Medium",
        attachment: attachment || null,
        image: image || null,
        courseId: courseId ? Number(courseId) : null,
        targetAudience: targetAudience || "All",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    })
    return NextResponse.json({ announcement }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
