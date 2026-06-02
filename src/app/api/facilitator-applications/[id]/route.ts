import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

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
    const { status } = body
    if (!status || !["Approved", "Declined"].includes(status)) {
      return NextResponse.json({ error: "status must be Approved or Declined" }, { status: 400 })
    }
    const application = await prisma.facilitatorApplication.findUnique({
      where: { id: Number(id) },
    })
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    const updated = await prisma.facilitatorApplication.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    })
    if (status === "Approved") {
      await prisma.user.update({
        where: { id: application.userId },
        data: { status: "Active" },
      })
    }
    return NextResponse.json({ application: updated })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
