import Link from "next/link"
import { MdihubLogo } from "../components/mdihub-logo"
import {
  BookOpen, Users, GraduationCap, Calendar, FileText, BarChart3,
  ArrowRight, Award,
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Create, organize, and deliver engaging courses with multimedia content, quizzes, and assignments.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Granular access control for Admins, Facilitators, and Students with role-specific dashboards.",
  },
  {
    icon: GraduationCap,
    title: "Learning Paths",
    description: "Structured learning journeys with modules, lessons, and progress tracking at every step.",
  },
  {
    icon: Calendar,
    title: "Calendar & Scheduling",
    description: "Built-in calendar for deadlines, events, and scheduled activities across all courses.",
  },
  {
    icon: FileText,
    title: "Assignments & Quizzes",
    description: "Create assignments and quizzes with automatic grading, submissions tracking, and feedback.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Track student performance, course completion rates, and generate detailed progress reports.",
  },
]

const stats = [
  { label: "Active Courses", value: "50+" },
  { label: "Students Enrolled", value: "1,200+" },
  { label: "Facilitators", value: "80+" },
  { label: "Completion Rate", value: "94%" },
]

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account as a Student, Facilitator, or Administrator.",
  },
  {
    number: "02",
    title: "Enroll or Create",
    description: "Browse available courses and enroll, or create your own curriculum.",
  },
  {
    number: "03",
    title: "Learn & Track",
    description: "Complete modules, submit assignments, and monitor progress in real time.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <MdihubLogo width={32} height={32} />
            <span className="text-lg font-bold tracking-tight">MDiHub</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </Link>
            <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/signin"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all duration-200"
            >
              Get started
            </Link>
          </nav>
          <Link
            href="/signin"
            className="sm:hidden inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all duration-200"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--gold)_0%,_transparent_70%)] opacity-[0.07]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-16 sm:pt-24 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-in">
              <Award className="h-3.5 w-3.5 text-gold" />
              The modern learning management platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
              Learn, teach, and{" "}
              <span className="text-gradient-gold">grow</span>
              {" "}together
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto animate-slide-up">
              MDiHub LMS empowers educators and learners with a powerful platform for
              course creation, collaboration, and progress tracking — all in one place.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4 animate-slide-up">
              <Link
                href="/signin"
                className="group inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all duration-200"
              >
                Get started free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-6 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-2xl sm:text-3xl font-bold text-gradient-gold">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
            <p className="mt-4 text-muted-foreground">
              A complete learning management system designed for modern education.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group card-hover rounded-xl border bg-card p-6 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-muted-foreground">
              Get started in three simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-lg font-bold text-gold">
                  {step.number}
                </div>
                <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-dark p-8 sm:p-12 lg:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--gold)_0%,_transparent_60%)] opacity-[0.08]" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to transform learning?</h2>
              <p className="mt-4 text-sm sm:text-base text-white/60 max-w-lg mx-auto">
                Join MDiHub LMS today and experience a smarter way to learn and teach.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link
                  href="/signin"
                  className="group inline-flex h-11 items-center justify-center rounded-lg bg-gold px-6 text-sm font-medium text-black shadow hover:bg-gold-dark transition-all duration-200"
                >
                  Get started free <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/signin"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/10 px-6 text-sm font-medium text-white/80 shadow-sm hover:bg-white/5 hover:text-white transition-all duration-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-gold flex items-center justify-center">
                <span className="text-black font-bold text-xs">M</span>
              </div>
              <span className="text-sm font-semibold">MDiHub</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} MDiHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
