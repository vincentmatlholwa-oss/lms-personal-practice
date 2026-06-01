"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { mockQuizzes, mockSubmissions } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, ChevronRight, ClipboardList, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const courseId = Number(params.courseId)
  const moduleId = Number(params.moduleId)
  const quizId = Number(params.quizId)

  const existing = user ? mockSubmissions.find((s) => s.userId === user.id && s.activityId === quizId && s.activityType === "quiz") : undefined
  const [answers, setAnswers] = useState<Record<number, number>>(
    existing ? JSON.parse(existing.content) : {}
  )
  const [submitted, setSubmitted] = useState(!!existing)
  const [showReview, setShowReview] = useState(false)

  if (!user) return null

  const quiz = mockQuizzes.find((q) => q.id === quizId)
  if (!quiz) return <div className="p-6"><h1>Quiz not found</h1></div>

  const handleSubmit = () => {
    const unanswered = quiz.questions.filter((q) => answers[q.id] === undefined)
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`)
      return
    }
    let score = 0
    let total = 0
    quiz.questions.forEach((q) => {
      total += q.markAllocation
      if (answers[q.id] === q.correctAnswer) score += q.markAllocation
    })
    mockSubmissions.push({
      id: mockSubmissions.length + 1,
      userId: user.id,
      activityId: quizId,
      activityType: "quiz",
      content: JSON.stringify(answers),
      submittedAt: new Date().toISOString(),
      marks: score,
      totalMarks: total,
      graded: true,
    })
    setSubmitted(true)
    setShowReview(true)
    toast.success(`Quiz submitted! Score: ${score}/${total}`)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="animate-slide-up">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <button onClick={() => router.push(`/courses`)} className="hover:text-gold">Courses</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => router.push(`/courses/${courseId}`)} className="hover:text-gold">Course</button>
          <ChevronRight className="w-3 h-3" />
          <button onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)} className="hover:text-gold">Module</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{quiz.title}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: "40ms" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>{quiz.title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{quiz.description}</p>
        </div>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>{quiz.timeLimit} minutes</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {submitted && !showReview ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                <ClipboardList className="w-8 h-8 text-success" />
              </div>
              <h3>Quiz Submitted</h3>
              {existing && (
                <p className="text-muted-foreground">
                  Your score: {existing.marks}/{existing.totalMarks} ({Math.round((existing.marks! / existing.totalMarks!) * 100)}%)
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}>
                  Back to Module
                </Button>
                <Button onClick={() => setShowReview(true)}>
                  Review Answers
                </Button>
              </div>
            </div>
          ) : showReview ? (
            <div className="space-y-6">
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg flex items-center justify-between">
                <span className="font-medium">Your Score</span>
                <span className="text-xl font-bold text-success">
                  {existing?.marks || 0}/{existing?.totalMarks || 0}
                  {" "}({Math.round(((existing?.marks || 0) / (existing?.totalMarks || 1)) * 100)}%)
                </span>
              </div>
              {quiz.questions.map((q, idx) => {
                const userAnswer = answers[q.id]
                const isCorrect = userAnswer === q.correctAnswer
                return (
                  <div key={q.id} className={`p-4 border rounded-lg space-y-3 ${isCorrect ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />}
                        <div>
                          <p className="font-medium">{idx + 1}. {q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">{q.markAllocation} marks</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-7">
                      {q.answers.map((answer, ai) => {
                        let className = "p-2 rounded-md text-sm border "
                        if (ai === q.correctAnswer) {
                          className += "border-success bg-success/10 text-success"
                        } else if (ai === userAnswer && ai !== q.correctAnswer) {
                          className += "border-destructive bg-destructive/10 text-destructive"
                        } else {
                          className += "border-transparent text-muted-foreground"
                        }
                        return (
                          <div key={ai} className={className}>
                            {String.fromCharCode(65 + ai)}. {answer}
                            {ai === q.correctAnswer && <CheckCircle className="w-3 h-3 inline ml-1" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <Button variant="outline" className="w-full" onClick={() => router.push(`/courses/${courseId}/modules/${moduleId}`)}>
                Back to Module
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <div key={q.id} className="p-4 border rounded-lg space-y-3 card-hover">
                  <div className="flex items-start justify-between">
                    <p className="font-medium">
                      {idx + 1}. {q.question}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{q.markAllocation} marks</span>
                  </div>
                  <RadioGroup
                    value={answers[q.id]?.toString()}
                    onValueChange={(v) => setAnswers({ ...answers, [q.id]: parseInt(v) })}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {q.answers.map((answer, ai) => (
                        <div key={ai} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                          <RadioGroupItem value={ai.toString()} id={`q${q.id}-a${ai}`} />
                          <Label htmlFor={`q${q.id}-a${ai}`} className="text-sm cursor-pointer">
                            {String.fromCharCode(65 + ai)}. {answer}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <Button className="w-full" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}