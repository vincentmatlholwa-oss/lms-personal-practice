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
    const entry = await prisma.gradebookEntry.findUnique({ where: { id: Number(id) } })
    if (!entry) return NextResponse.json({ error: "Gradebook entry not found" }, { status: 404 })
    return NextResponse.json({ entry })
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
    const existing = await prisma.gradebookEntry.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Gradebook entry not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | number> = {}
    if (body.score !== undefined) updateData.score = Number(body.score)
    if (body.total !== undefined) updateData.total = Number(body.total)
    if (body.activityName !== undefined) updateData.activityName = body.activityName
    if (body.activityType !== undefined) updateData.activityType = body.activityType
    if (body.date !== undefined) updateData.date = body.date
    const entry = await prisma.gradebookEntry.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ entry })
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
    const existing = await prisma.gradebookEntry.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Gradebook entry not found" }, { status: 404 })
    await prisma.gradebookEntry.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
