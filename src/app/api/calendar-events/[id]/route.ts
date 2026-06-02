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
    const existing = await prisma.calendarEvent.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | number | null> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.date !== undefined) updateData.date = body.date
    if (body.type !== undefined) updateData.type = body.type
    if (body.courseId !== undefined) updateData.courseId = body.courseId ? Number(body.courseId) : null
    const event = await prisma.calendarEvent.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ event })
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
    const existing = await prisma.calendarEvent.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 })
    await prisma.calendarEvent.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
