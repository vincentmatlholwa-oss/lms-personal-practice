"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"

interface ChatMessage {
  role: "user" | "bot"
  text: string
}

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

function getBotResponse(input: string): string {
  const lower = input.toLowerCase()

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `Hello! I'm the MDiHub assistant. How can I help you today? You can ask me about courses, assignments, grades, quizzes, or anything else about the platform.`
  }

  if (lower.includes("thank")) {
    return "You're welcome! Feel free to ask if you need anything else."
  }

  if (lower.includes("what") && (lower.includes("you") || lower.includes("are"))) {
    return "I'm the MDiHub learning assistant! I can help you navigate the platform, answer questions about courses, assignments, grades, and more. Try asking me something specific!"
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

  return `I'm not sure about that. Try asking about:\n• Submitting assignments\n• Checking grades\n• Enrolling in courses\n• Becoming a facilitator\n• Certificates\n• Quizzes\n• Progress tracking`
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Hi! I'm the MDiHub assistant. Ask me anything about the platform." },
  ])
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")

    const response = getBotResponse(userMsg)

    setMessages((prev) => [...prev, { role: "user", text: userMsg }, { role: "bot", text: response }])
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          open ? "bg-destructive rotate-90 scale-110" : "bg-gradient-gold scale-100 hover:scale-110"
        )}
      >
        {open ? <X className="w-6 h-6 text-black" /> : <MessageCircle className="w-6 h-6 text-black" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-gradient-gold p-4 text-black">
            <p className="font-semibold text-sm">MDiHub Assistant</p>
            <p className="text-[11px] opacity-80">Ask me anything about the platform</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {msg.role === "bot" && msg.text.includes("\n") ? (
                    <ul className="space-y-1">
                      {msg.text.split("\n").map((line, li) => (
                        <li key={li} className="flex items-start gap-1.5">
                          {line.startsWith("•") ? (
                            <><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gold" /><span>{line.slice(1)}</span></>
                          ) : (
                            <span>{line}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
              placeholder="Type your question..."
              className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-gold/50"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
