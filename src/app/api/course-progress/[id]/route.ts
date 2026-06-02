import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const { id } = await params
    const existing = await prisma.courseProgress.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Course progress not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | boolean> = {}
    if (body.completedModuleIds !== undefined) updateData.completedModuleIds = JSON.stringify(body.completedModuleIds)
    if (body.completedLessonIds !== undefined) updateData.completedLessonIds = JSON.stringify(body.completedLessonIds)
    if (body.completedAt !== undefined) updateData.completedAt = body.completedAt
    const progress = await prisma.courseProgress.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ progress })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const { id } = await params
    const existing = await prisma.courseProgress.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Course progress not found" }, { status: 404 })
    await prisma.courseProgress.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
