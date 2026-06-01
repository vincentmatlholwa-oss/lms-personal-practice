"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../lib/auth-context"
import { Clock, LogOut } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/signin")
    }
  }, [user, router])

  if (!user) return null

  if (user.status === "Pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Application Pending</h1>
          <p className="text-muted-foreground">
            Your facilitator application is under review. An administrator will
            activate your account once the review is complete. You will be able
            to sign in once your account is activated.
          </p>
          <div className="bg-muted rounded-lg p-4 text-left space-y-2">
            <p className="text-sm font-medium">Application Details</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Name: {user.firstName} {user.lastName}</p>
              <p>Email: {user.email}</p>
              <p>Status: <span className="text-amber-600 font-medium">Pending Approval</span></p>
            </div>
          </div>
          <button
            onClick={() => { signOut(); router.push("/signin") }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
