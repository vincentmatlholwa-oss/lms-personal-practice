import { NextResponse } from "next/server"

const courses = [
  { id: 1, title: "Mathematics 101", description: "Introduction to algebra and geometry.", status: "Active" },
  { id: 2, title: "Computer Science Fundamentals", description: "Programming basics.", status: "Active" },
]

export async function GET() {
  return NextResponse.json({ courses })
}

export async function POST(request: Request) {
  const body = await request.json()
  const course = { id: courses.length + 1, ...body }
  courses.push(course)
  return NextResponse.json({ course }, { status: 201 })
}