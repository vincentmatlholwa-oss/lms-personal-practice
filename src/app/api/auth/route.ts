import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signToken, verifyToken } from "@/lib/jwt"

export async function POST(request: Request) {
  const body = await request.json()
  const { action } = body

  if (action === "signin") {
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser, token })
  }

  if (action === "register") {
    const { firstName, lastName, email, password, role, phone, idNumber, subject, qualifications, experience } = body
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const status = role === "Facilitator" ? "Pending" : "Active"
    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed, role: role || "Student", status, phone: phone || "", idNumber: idNumber || "" },
    })
    if (role === "Facilitator") {
      await prisma.facilitatorApplication.create({
        data: {
          userId: user.id,
          subject: subject || "",
          qualifications: qualifications || "",
          experience: experience || "",
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
        },
      })
    }
    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser, token })
  }

  if (action === "me") {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    const { password: _, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
