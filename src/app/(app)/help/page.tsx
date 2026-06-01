"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { HelpCircle, UserPlus, BookOpen, KeyRound, MessageCircle, FileText, ArrowLeft } from "lucide-react"

const helpTopics = [
  {
    icon: UserPlus,
    title: "Creating an Account",
    description: "Navigate to the login page and click 'Register'. Fill in your details including first name, last name, email, password, phone, and ID number. Select your role (Student, Facilitator, or Admin). Facilitators require admin approval before they can sign in.",
  },
  {
    icon: KeyRound,
    title: "Resetting Your Password",
    description: "On the sign-in page, click 'Forgot Password'. Enter your registered email address. Follow the instructions sent to your email to reset your password. If you don't receive an email, check your spam folder.",
  },
  {
    icon: BookOpen,
    title: "Enrolling in Courses",
    description: "Browse available courses from the Courses page or your dashboard. Click on a course to view details, then click 'Enroll Now'. Once enrolled, the course will appear in 'My Courses' where you can access modules, lessons, and assessments.",
  },
  {
    icon: FileText,
    title: "Completing Assessments",
    description: "Navigate to your course module and click on a quiz or assignment. Quizzes have multiple-choice questions with a time limit. Assignments allow text submission or file uploads. Once submitted, you cannot retake the assessment.",
  },
  {
    icon: MessageCircle,
    title: "Contacting Support",
    description: "For technical issues or questions, contact your course facilitator directly. Administrators can be reached for account-related issues. Check the announcements page for important updates from the school.",
  },
  {
    icon: HelpCircle,
    title: "Navigating the LMS",
    description: "Use the sidebar to access different sections: Dashboard for an overview, My Courses for enrolled courses, Calendar for upcoming events, and Profile to manage your account. The top bar shows notifications and your profile menu.",
  },
]

export default function HelpPage() {
  const router = useRouter()

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Help Center</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Find answers to common questions and learn how to use MDiHub LMS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "80ms" }}>
        {helpTopics.map((topic) => {
          const Icon = topic.icon
          return (
            <Card key={topic.title} className="border-0 shadow-card card-hover">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
