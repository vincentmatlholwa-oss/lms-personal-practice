import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  try {
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
      include: {
        modules: {
          include: {
            lessons: true,
            quizzes: true,
            assignments: true,
          },
        },
      },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json({ course })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json()
    const existing = await prisma.course.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    const updateData: Record<string, string | number | null> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.startDate !== undefined) updateData.startDate = body.startDate
    if (body.endDate !== undefined) updateData.endDate = body.endDate
    if (body.status !== undefined) updateData.status = body.status
    if (body.facilitatorId !== undefined) {
      updateData.facilitatorId = body.facilitatorId ? Number(body.facilitatorId) : null
    }
    const course = await prisma.course.update({
      where: { id: Number(id) },
      data: updateData,
    })
    return NextResponse.json({ course })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  try {
    const { id } = await params
    const existing = await prisma.course.findUnique({ where: { id: Number(id) } })
    if (!existing) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    await prisma.course.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
