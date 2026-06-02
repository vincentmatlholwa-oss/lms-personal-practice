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
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json({ error: "userId query parameter required" }, { status: 400 })
    }
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { id: "desc" },
    })
    return NextResponse.json({ notifications })
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
    const { userId, title, message, link } = body
    if (!userId || !title || !message) {
      return NextResponse.json({ error: "userId, title, and message required" }, { status: 400 })
    }
    const notification = await prisma.notification.create({
      data: {
        userId: Number(userId),
        title,
        message,
        date: new Date().toISOString().split("T")[0],
        link: link || null,
      },
    })
    return NextResponse.json({ notification }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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
    if (!body.id && !body.ids) {
      return NextResponse.json({ error: "id or ids required" }, { status: 400 })
    }
    const ids = body.ids || [body.id]
    await prisma.notification.updateMany({
      where: { id: { in: ids.map(Number) } },
      data: { read: true },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
