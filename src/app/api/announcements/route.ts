import { NextResponse } from "next/server"

const announcements = [
  { id: 1, title: "System Maintenance", description: "LMS will be down on June 1st.", date: "2026-05-20", priority: "High" },
]

export async function GET() {
  return NextResponse.json({ announcements })
}

export async function POST(request: Request) {
  const body = await request.json()
  const announcement = { id: announcements.length + 1, date: new Date().toISOString().split("T")[0], ...body }
  announcements.unshift(announcement)
  return NextResponse.json({ announcement }, { status: 201 })
}