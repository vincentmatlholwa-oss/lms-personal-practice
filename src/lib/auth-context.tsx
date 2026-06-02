"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { mockUsers, mockFacilitatorApplications, type User, type Role } from "./mock-data"

interface AuthContextType {
  user: User | null
  users: User[]
  signIn: (email: string, password: string) => Promise<User | null>
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: Role
    phone: string
    idNumber: string
    subject?: string
    qualifications?: string
    experience?: string
  }) => Promise<User>
  signOut: () => void
  updateUser: (updated: User) => void
  setUsers: (users: User[]) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const stored = sessionStorage.getItem("lms_user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    sessionStorage.setItem("lms_user", JSON.stringify(user))
  } else {
    sessionStorage.removeItem("lms_user")
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem("lms_token")
}

function storeToken(token: string | null) {
  if (typeof window === "undefined") return
  if (token) {
    sessionStorage.setItem("lms_token", token)
  } else {
    sessionStorage.removeItem("lms_token")
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([...mockUsers])
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [initialized] = useState(true)

  useEffect(() => {
    if (initialized) storeUser(user)
  }, [user, initialized])

  const signIn = useCallback(async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signin", email, password }),
      })
      if (!res.ok) return null
      const data = await res.json()
      setUser(data.user)
      storeToken(data.token)
      return data.user
    } catch {
      return null
    }
  }, [])

  const register = useCallback(async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: Role
    phone: string
    idNumber: string
    subject?: string
    qualifications?: string
    experience?: string
  }): Promise<User> => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "register", ...data }),
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.error || "Registration failed")

    setUser(result.user)
    storeToken(result.token)
    return result.user
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    storeToken(null)
  }, [])

  const updateUser = useCallback((updated: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider value={{ user, users, signIn, register, signOut, updateUser, setUsers }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
