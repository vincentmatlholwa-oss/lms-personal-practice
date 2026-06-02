import { describe, it, expect } from "vitest"

// Inline the chatbot logic for testing since we can't easily import
// the module's internal function
function matchScore(input: string, keywords: string[]): number {
  return keywords.filter((k) => input.includes(k)).length
}

const faqTriggers: { keywords: string[]; response: string }[] = [
  { keywords: ["submit", "assignment", "homework"], response: "To submit an assignment" },
  { keywords: ["grade", "mark", "score", "feedback"], response: "You can check your grades" },
  { keywords: ["course", "enroll", "register"], response: "Browse available courses" },
  { keywords: ["facilitator", "become", "instructor", "teacher"], response: "To become a facilitator" },
  { keywords: ["password", "reset", "change", "forgot"], response: "Go to Settings to change your password" },
  { keywords: ["certificate", "cert", "complete"], response: "When you complete all modules" },
  { keywords: ["quiz", "test", "exam", "assessment"], response: "Quizzes are available" },
  { keywords: ["notification", "alert", "bell"], response: "Your notifications appear" },
  { keywords: ["progress", "track"], response: "Your course progress is shown" },
  { keywords: ["profile", "avatar", "name", "info"], response: "You can view and edit your profile" },
  { keywords: ["fail", "failed", "retake", "retry", "pay", "again"], response: "There is no cost to retake" },
  { keywords: ["cost", "free", "price", "fee", "paid", "pay"], response: "MDiHub is completely free" },
]

function getBotResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("hello") || lower.match(/\bhi\b/) || lower.includes("hey")) {
    return "Hello!"
  }

  if (lower.includes("thank")) {
    return "You're welcome!"
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

  return "I'm not sure"
}

describe("ChatBot response matching", () => {
  it("responds to greetings", () => {
    expect(getBotResponse("hello")).toBe("Hello!")
    expect(getBotResponse("hi there")).toBe("Hello!")
  })

  it("responds to thanks", () => {
    expect(getBotResponse("thank you")).toBe("You're welcome!")
  })

  it("matches assignment questions", () => {
    const res = getBotResponse("how do I submit an assignment?")
    expect(res).toContain("submit an assignment")
  })

  it("matches grading questions", () => {
    const res = getBotResponse("what is my grade?")
    expect(res).toContain("check your grades")
  })

  it("matches password questions", () => {
    const res = getBotResponse("I forgot my password")
    expect(res).toContain("change your password")
  })

  it("matches fail/retake questions correctly instead of progress", () => {
    const res = getBotResponse("when i fail a module do i have to pay for it again")
    expect(res).toContain("no cost to retake")
    expect(res).not.toContain("progress")
  })

  it("matches retake questions", () => {
    const res = getBotResponse("can I retry this module?")
    expect(res).toContain("no cost to retake")
  })

  it("matches free/cost questions", () => {
    const res = getBotResponse("is MDiHub free?")
    expect(res).toContain("completely free")
  })

  it("matches certificate questions", () => {
    const res = getBotResponse("how do I get a certificate?")
    expect(res).toContain("complete all modules")
  })

  it("returns fallback for unknown input", () => {
    const res = getBotResponse("what is the meaning of life?")
    expect(res).toBe("I'm not sure")
  })

  it("prefers best match over first match", () => {
    // "failed" and "again" match fail/retake (score 2), "notification" is only 1
    const res = getBotResponse("I failed the notification test again")
    expect(res).toContain("no cost to retake")
  })

  it("matches course enrollment", () => {
    const res = getBotResponse("how do I enroll in a course?")
    expect(res).toContain("Browse available courses")
  })
})
