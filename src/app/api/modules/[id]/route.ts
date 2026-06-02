import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const { id } = await params
    const module = await prisma.module.findUnique({
      where: { id: Number(id) },
      include: { lessons: { include: { activities: true } }, quizzes: { include: { questions: true } }, assignments: true },
    })
    if (!module) return NextResponse.json({ error: "Module not found" }, { status: 404 })
    return NextResponse.json({ module })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "No token provided" }, { status: 401 })
  const payload = verifyToken(authHeader.slice(7))
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  try {
    const { id } = await params
    const existing = await prisma.module.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Module not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | number> = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.order !== undefined) updateData.order = Number(body.order)
    const mod = await prisma.module.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ module: mod })
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
    const existing = await prisma.module.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Module not found" }, { status: 404 })
    await prisma.module.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
