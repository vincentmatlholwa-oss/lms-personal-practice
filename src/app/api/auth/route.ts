import { NextResponse } from "next/server"

const users = [
  { id: 1, firstName: "Admin", lastName: "User", email: "admin@mdihub.com", password: "admin123", role: "Admin" },
  { id: 2, firstName: "John", lastName: "Doe", email: "john@email.com", password: "pass123", role: "Student" },
]

export async function POST(request: Request) {
  const body = await request.json()
  const { action, email, password } = body

  if (action === "signin") {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const safe = users.map(({ password: _pw, ...u }) => u)
  return NextResponse.json({ users: safe })
}