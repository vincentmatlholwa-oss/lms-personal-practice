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
    const existing = await prisma.activity.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | number | null> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate
    if (body.timeLimit !== undefined) updateData.timeLimit = body.timeLimit ? Number(body.timeLimit) : null
    const activity = await prisma.activity.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ activity })
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
    const existing = await prisma.activity.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    await prisma.activity.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
