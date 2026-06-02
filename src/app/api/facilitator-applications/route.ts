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
    const applications = await prisma.facilitatorApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
            phone: true,
            idNumber: true,
          },
        },
      },
      orderBy: { id: "desc" },
    })
    return NextResponse.json({ applications })
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
    const { userId, subject, qualifications, experience } = body
    if (!userId || !subject || !qualifications || !experience) {
      return NextResponse.json({ error: "userId, subject, qualifications, and experience required" }, { status: 400 })
    }
    const application = await prisma.facilitatorApplication.create({
      data: {
        userId: Number(userId),
        subject,
        qualifications,
        experience,
        date: new Date().toISOString().split("T")[0],
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
    return NextResponse.json({ application }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
