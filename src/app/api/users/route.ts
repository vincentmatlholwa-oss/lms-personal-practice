import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    users: [
      { id: 1, firstName: "Admin", lastName: "User", email: "admin@mdihub.com", role: "Admin", status: "Active" },
      { id: 2, firstName: "John", lastName: "Doe", email: "john@email.com", role: "Student", status: "Active" },
    ]
  })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ user: { id: Date.now(), ...body } }, { status: 201 })
}