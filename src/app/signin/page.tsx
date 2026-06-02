"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { MdihubLogo } from "../../components/mdihub-logo"
import { Eye, EyeOff, LogIn, UserPlus, KeyRound, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "../../lib/auth-context"

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address"
  return null
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required"
  if (password.length < 6) return "Password must be at least 6 characters"
  return null
}

function validateName(name: string, label: string): string | null {
  if (!name.trim()) return `${label} is required`
  if (name.trim().length < 2) return `${label} must be at least 2 characters`
  return null
}

export default function SignInPage() {
  const router = useRouter()
  const { signIn, register, users } = useAuth()
  const [mode, setMode] = useState<"signin" | "register" | "forgot">("signin")
  const [showPassword, setShowPassword] = useState(false)

  const [signinForm, setSigninForm] = useState({ email: "", password: "" })
  const [signinErrors, setSigninErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotError, setForgotError] = useState<string | null>(null)

  const [registerForm, setRegisterForm] = useState({
    firstName: "", lastName: "", email: "", password: "", role: "Student" as "Student" | "Facilitator" | "Admin",
    phone: "", idNumber: "", subject: "", qualifications: "", experience: "",
  })
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({})

  const emailExists = useMemo(
    () => (email: string) => users.some((u) => u.email.toLowerCase() === email.toLowerCase()),
    [users]
  )

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const emailErr = validateEmail(signinForm.email)
    const passErr = validatePassword(signinForm.password)
    setSigninErrors({ email: emailErr ?? undefined, password: passErr ?? undefined })
    if (emailErr || passErr) { setSubmitting(false); return }
    const user = await signIn(signinForm.email, signinForm.password)
    if (!user) {
      toast.error("Invalid email or password")
      setSubmitting(false)
      return
    }
    if (user.status === "Suspended") {
      toast.error("Your account has been suspended. Contact an administrator.", { duration: 5000 })
      setSubmitting(false)
      return
    }
    toast.success(`Welcome back, ${user.firstName}!`)
    router.push("/dashboard")
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = validateEmail(forgotEmail)
    if (emailErr) { setForgotError(emailErr); return }
    setForgotError(null)
    const user = users.find((u) => u.email === forgotEmail)
    if (!user) {
      toast.error("No account found with that email address")
      return
    }
    setForgotSent(true)
    toast.success(`Password reset instructions sent to ${forgotEmail}`)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    const fnErr = validateName(registerForm.firstName, "First name")
    if (fnErr) errors.firstName = fnErr
    const lnErr = validateName(registerForm.lastName, "Last name")
    if (lnErr) errors.lastName = lnErr
    const emailErr = validateEmail(registerForm.email)
    if (emailErr) errors.email = emailErr
    const passErr = validatePassword(registerForm.password)
    if (passErr) errors.password = passErr
    if (!registerForm.phone.trim()) errors.phone = "Phone number is required"
    if (!registerForm.idNumber.trim()) errors.idNumber = "ID number is required"
    setRegisterErrors(errors)
    if (Object.keys(errors).length > 0) return
    try {
      const newUser = await register(registerForm)
      if (newUser.role === "Facilitator") {
        toast.success("Application submitted! An admin will review and activate your account.", { duration: 6000 })
        setMode("signin")
      } else {
        toast.success("Account created successfully! Welcome aboard.")
        router.push("/dashboard")
      }
    } catch {
      toast.error("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 animate-fade-in">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <MdihubLogo width={32} height={32} />
          <span className="text-lg font-bold tracking-tight">MDiHub</span>
        </Link>
        <Card className="border-0 shadow-xl shadow-black/5">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {mode === "signin"
                ? "Sign in to continue to MDiHub LMS"
                : "Register for a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
              {mode === "forgot" ? (
                <form onSubmit={handleForgotPassword} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email address</Label>
                    <Input id="forgot-email" type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => { setForgotEmail(e.target.value); setForgotError(null) }} className={`h-11 ${forgotError ? "border-destructive" : ""}`} />
                    {forgotError && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{forgotError}</p>}
                  </div>
                  {forgotSent ? (
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg text-center">
                      <p className="text-sm text-success font-medium">Check your email!</p>
                      <p className="text-xs text-muted-foreground mt-1">Password reset instructions have been sent.</p>
                    </div>
                  ) : (
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground">
                      <KeyRound className="w-4 h-4 mr-2" /> Send Reset Instructions
                    </Button>
                  )}
                  <p className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <button type="button" onClick={() => { setMode("signin"); setForgotSent(false) }} className="text-gold hover:text-gold-dark font-medium transition-colors">
                      Sign in
                    </button>
                  </p>
                </form>
              ) : mode === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-5" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email address</Label>
                    <Input id="signin-email" type="email" placeholder="you@example.com" value={signinForm.email} onChange={(e) => { setSigninForm({ ...signinForm, email: e.target.value }); setSigninErrors((prev) => ({ ...prev, email: undefined })) }} className={`h-11 ${signinErrors.email ? "border-destructive" : ""}`} />
                    {signinErrors.email && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{signinErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <button type="button" onClick={() => setMode("forgot")} className="text-xs text-gold hover:text-gold-dark font-medium transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={signinForm.password} onChange={(e) => { setSigninForm({ ...signinForm, password: e.target.value }); setSigninErrors((prev) => ({ ...prev, password: undefined })) }} className={`h-11 pr-10 ${signinErrors.password ? "border-destructive" : ""}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {signinErrors.password && <p className="text-xs text-destructive flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{signinErrors.password}</p>}
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                    <LogIn className="w-4 h-4 mr-2" /> Sign in
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => { setMode("register"); setShowPassword(false) }} className="text-gold hover:text-gold-dark font-medium transition-colors">
                      Register
                    </button>
                  </p>
                  <div className="pt-6 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-3 text-center uppercase tracking-wider">Demo Accounts</p>
                    <div className="space-y-2">
                      {[
                        { email: "admin@mdihub.com", password: "admin123", role: "Admin" },
                        { email: "john@email.com", password: "pass123", role: "Student" },
                        { email: "mike@email.com", password: "pass123", role: "Facilitator" },
                      ].map((acc) => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => setSigninForm({ email: acc.email, password: acc.password })}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm bg-muted hover:bg-accent/10 hover:border-gold/30 border border-transparent transition-all duration-200 group"
                        >
                          <span className="font-medium text-foreground">{acc.role}</span>
                          <span className="text-muted-foreground text-xs">{acc.email}</span>
                          <span className="text-muted-foreground font-mono text-xs group-hover:text-gold transition-colors">{acc.password}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center mt-3">Click to auto-fill credentials</p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="reg-first">First name</Label>
                      <Input id="reg-first" placeholder="John" value={registerForm.firstName} onChange={(e) => { setRegisterForm({ ...registerForm, firstName: e.target.value }); setRegisterErrors((prev) => ({ ...prev, firstName: "" })) }} className={`h-11 ${registerErrors.firstName ? "border-destructive" : ""}`} />
                      {registerErrors.firstName && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-last">Last name</Label>
                      <Input id="reg-last" placeholder="Doe" value={registerForm.lastName} onChange={(e) => { setRegisterForm({ ...registerForm, lastName: e.target.value }); setRegisterErrors((prev) => ({ ...prev, lastName: "" })) }} className={`h-11 ${registerErrors.lastName ? "border-destructive" : ""}`} />
                      {registerErrors.lastName && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email address</Label>
                    <Input id="reg-email" type="email" placeholder="you@example.com" value={registerForm.email} onChange={(e) => { setRegisterForm({ ...registerForm, email: e.target.value }); setRegisterErrors((prev) => ({ ...prev, email: "" })) }} className={`h-11 ${registerErrors.email ? "border-destructive" : ""}`} />
                    {registerErrors.email && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Create a password (min 6 characters)" value={registerForm.password} onChange={(e) => { setRegisterForm({ ...registerForm, password: e.target.value }); setRegisterErrors((prev) => ({ ...prev, password: "" })) }} className={`h-11 pr-10 ${registerErrors.password ? "border-destructive" : ""}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerErrors.password && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.password}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Phone</Label>
                      <Input id="reg-phone" type="tel" placeholder="0123456789" value={registerForm.phone} onChange={(e) => { setRegisterForm({ ...registerForm, phone: e.target.value }); setRegisterErrors((prev) => ({ ...prev, phone: "" })) }} className={`h-11 ${registerErrors.phone ? "border-destructive" : ""}`} />
                      {registerErrors.phone && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-id">ID number</Label>
                      <Input id="reg-id" placeholder="ID001" value={registerForm.idNumber} onChange={(e) => { setRegisterForm({ ...registerForm, idNumber: e.target.value }); setRegisterErrors((prev) => ({ ...prev, idNumber: "" })) }} className={`h-11 ${registerErrors.idNumber ? "border-destructive" : ""}`} />
                      {registerErrors.idNumber && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{registerErrors.idNumber}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-role">Register as</Label>
                    <Select value={registerForm.role} onValueChange={(value: "Student" | "Facilitator" | "Admin") => setRegisterForm({ ...registerForm, role: value })}>
                      <SelectTrigger id="reg-role" className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Facilitator">Facilitator</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {registerForm.role === "Facilitator" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="reg-subject">Subject expertise</Label>
                        <Input id="reg-subject" placeholder="e.g. Mathematics, Computer Science" value={registerForm.subject} onChange={(e) => setRegisterForm({ ...registerForm, subject: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-qualifications">Qualifications</Label>
                        <Input id="reg-qualifications" placeholder="e.g. M.Ed in Mathematics, B.Sc in Computer Science" value={registerForm.qualifications} onChange={(e) => setRegisterForm({ ...registerForm, qualifications: e.target.value })} className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-experience">Experience</Label>
                        <textarea id="reg-experience" placeholder="Describe your teaching or industry experience..." value={registerForm.experience} onChange={(e) => setRegisterForm({ ...registerForm, experience: e.target.value })} className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                      </div>
                    </>
                  )}
                  <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200">
                    <UserPlus className="w-4 h-4 mr-2" /> Create account
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button type="button" onClick={() => { setMode("signin"); setShowPassword(false) }} className="text-gold hover:text-gold-dark font-medium transition-colors">
                      Sign in
                    </button>
                  </p>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    <Link href="/" className="hover:text-gold transition-colors">Back to home</Link>
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
