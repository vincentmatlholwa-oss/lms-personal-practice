"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, ChevronRight } from "lucide-react"
import { cn } from "../lib/utils"

interface ChatMessage {
  role: "user" | "assistant"
  text: string
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! I'm the MDiHub AI assistant. Ask me anything about the platform." },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const userMsg = input.trim()
    setInput("")
    setIsLoading(true)

    const newUserMsg: ChatMessage = { role: "user", text: userMsg }
    setMessages((prev) => [...prev, newUserMsg])
    setMessages((prev) => [...prev, newUserMsg])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newUserMsg].map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.reply) {
          setMessages((prev) => [...prev, { role: "assistant", text: data.reply }])
          return
        }
      }
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I'm having trouble connecting. Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          open ? "bg-destructive rotate-90 scale-110" : "bg-gradient-gold scale-100 hover:scale-110"
        )}
      >
        {open ? <X className="w-6 h-6 text-black" /> : <Bot className="w-6 h-6 text-black" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] max-h-[70vh] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="bg-gradient-gold p-4 text-black flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">MDiHub AI Assistant</p>
              <p className="text-[11px] opacity-80">Powered by AI</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center shrink-0 mr-2 mt-1">
                    <Bot className="w-3.5 h-3.5 text-black" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {msg.role === "assistant" && msg.text.includes("\n") ? (
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center shrink-0 mr-2 mt-1">
                  <Bot className="w-3.5 h-3.5 text-black" />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 bg-muted">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
              placeholder="Type your question..."
              disabled={isLoading}
              className="flex-1 h-10 px-3 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
