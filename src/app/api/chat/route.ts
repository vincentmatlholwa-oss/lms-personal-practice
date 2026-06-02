import { NextResponse } from "next/server"

const API_KEY = process.env.OPENAI_API_KEY || process.env.AI_API_KEY
const API_URL = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions"
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini"

const SYSTEM_PROMPT = `You are the MDiHub learning assistant, a helpful AI for an LMS platform called MDiHub. 
Answer questions about the platform concisely and helpfully. 
MDiHub is a free learning platform where users can enroll in courses, submit assignments, take quizzes, earn certificates, and track progress. 
Users can also become facilitators (instructors) after admin approval.
Keep responses brief and friendly. If you don't know something, suggest what the user might try.`

const faqTriggers: { keywords: string[]; response: string }[] = [
  { keywords: ["submit", "assignment", "homework"], response: "To submit an assignment, go to the course module, open the assignment, type your answer in the text editor and click 'Submit Assignment'. You can also upload a file if the assignment allows it." },
  { keywords: ["grade", "mark", "score", "feedback"], response: "You can check your grades by going to each assignment page. Graded assignments will show your score and any feedback from your facilitator." },
  { keywords: ["course", "enroll", "register"], response: "Browse available courses from the Courses page. Click on any course to view details, then enroll. Your enrolled courses appear on the My Courses page and Dashboard." },
  { keywords: ["facilitator", "become", "instructor", "teacher"], response: "To become a facilitator, register with the 'Facilitator' role. Your application will be reviewed by an admin. Once approved, you can create and manage courses." },
  { keywords: ["password", "reset", "change", "forgot"], response: "Go to Settings to change your password. If you forgot your password, click 'Forgot password?' on the sign-in page and follow the instructions sent to your email." },
  { keywords: ["certificate", "cert", "complete"], response: "When you complete all modules in a course, you can claim a certificate from the Certificates page. The certificate includes a unique ID and can be downloaded." },
  { keywords: ["quiz", "test", "exam", "assessment"], response: "Quizzes are available within course modules. You can retake quizzes if the facilitator has enabled retakes. After submission, you'll see which answers were correct." },
  { keywords: ["notification", "alert", "bell"], response: "Your notifications appear in the bell icon on the top navigation bar. You can also view all notifications on the dedicated Notifications page." },
  { keywords: ["progress", "track"], response: "Your course progress is shown on course cards in the Dashboard and My Courses pages. Each module you complete increases your progress percentage." },
  { keywords: ["profile", "avatar", "name", "info"], response: "You can view and edit your profile information on the Profile page, including your name, email, phone number, and other details." },
  { keywords: ["fail", "failed", "retake", "retry", "pay", "again"], response: "There is no cost to retake a module or course. You can go back to the course and revisit any module at any time. If your facilitator has enabled quiz retakes, you can retry quizzes too. MDiHub is a free learning platform." },
  { keywords: ["cost", "free", "price", "fee", "paid", "pay"], response: "MDiHub is completely free to use. There are no costs for enrolling in courses, submitting assignments, or earning certificates. You can learn at your own pace without any fees." },
]

function matchScore(input: string, keywords: string[]): number {
  return keywords.filter((k) => input.includes(k)).length
}

function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("hello") || lower.match(/\bhi\b/) || lower.includes("hey")) {
    return "Hello! I'm the MDiHub assistant. How can I help you today?"
  }

  if (lower.includes("thank")) {
    return "You're welcome! Feel free to ask if you need anything else."
  }

  let best: { index: number; score: number } | null = null
  for (let i = 0; i < faqTriggers.length; i++) {
    const score = matchScore(lower, faqTriggers[i].keywords)
    if (score > 0 && (!best || score > best.score)) {
      best = { index: i, score }
    }
  }

  if (best && best.score > 0) {
    return faqTriggers[best.index].response
  }

  return "I'm not sure about that. Try asking about submitting assignments, checking grades, enrolling in courses, becoming a facilitator, certificates, quizzes, or progress tracking."
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: { role: string; content: string }[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 })
    }

    const userMessage = messages.find((m) => m.role === "user")?.content || ""

    if (API_KEY) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages.slice(-10),
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const reply = data.choices?.[0]?.message?.content
          if (reply) {
            return NextResponse.json({ reply })
          }
        }
      } catch {
        // Fallback to rule-based
      }
    }

    const reply = getFallbackResponse(userMessage)
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
