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
    const submission = await prisma.submission.findUnique({ where: { id: Number(id) } })
    if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    return NextResponse.json({ submission })
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
    const existing = await prisma.submission.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    const body = await request.json()
    const updateData: Record<string, string | number | boolean | null> = {}
    if (body.marks !== undefined) updateData.marks = Number(body.marks)
    if (body.totalMarks !== undefined) updateData.totalMarks = Number(body.totalMarks)
    if (body.graded !== undefined) updateData.graded = Boolean(body.graded)
    if (body.feedback !== undefined) updateData.feedback = body.feedback
    if (body.gradedBy !== undefined) updateData.gradedBy = Number(body.gradedBy)
    if (body.gradedAt !== undefined) updateData.gradedAt = body.gradedAt
    else if (body.graded) updateData.gradedAt = new Date().toISOString()
    const submission = await prisma.submission.update({ where: { id: Number(id) }, data: updateData })
    return NextResponse.json({ submission })
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
    const existing = await prisma.submission.findUnique({ where: { id: Number(id) } })
    if (!existing) return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    await prisma.submission.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
