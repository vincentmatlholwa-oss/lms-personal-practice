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
    const status = searchParams.get("status")
    const facilitatorId = searchParams.get("facilitatorId")
    const where: Record<string, string | number> = {}
    if (status) where.status = status
    if (facilitatorId) where.facilitatorId = Number(facilitatorId)
    const courses = await prisma.course.findMany({ where })
    return NextResponse.json({ courses })
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
    const { title, description, startDate, endDate, facilitatorId, status } = body
    if (!title || !description || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const course = await prisma.course.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        facilitatorId: facilitatorId ? Number(facilitatorId) : null,
        status: status || "Active",
      },
    })
    return NextResponse.json({ course }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
