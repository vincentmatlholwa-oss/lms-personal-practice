"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { mockUsers, mockFacilitatorApplications, type User, type Role } from "./mock-data"

interface AuthContextType {
  user: User | null
  users: User[]
  signIn: (email: string, password: string) => User | null
  register: (data: { firstName: string; lastName: string; email: string; password: string; role: Role; phone: string; idNumber: string; subject?: string; qualifications?: string; experience?: string }) => User
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([...mockUsers])
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [initialized] = useState(true)

  useEffect(() => {
    if (initialized) storeUser(user)
  }, [user, initialized])

  const signIn = useCallback((email: string, password: string): User | null => {
    const found = users.find((u) => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      return found
    }
    return null
  }, [users])

  const register = useCallback((data: { firstName: string; lastName: string; email: string; password: string; role: Role; phone: string; idNumber: string; subject?: string; qualifications?: string; experience?: string }): User => {
    const status = data.role === "Facilitator" ? "Pending" : "Active"
    const newUser: User = {
      id: users.length + 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role,
      status,
      phone: data.phone,
      idNumber: data.idNumber,
    }
    setUsers((prev) => [...prev, newUser])
    if (data.role === "Facilitator") {
      mockFacilitatorApplications.push({
        id: mockFacilitatorApplications.length + 1,
        userId: newUser.id,
        subject: data.subject || "",
        qualifications: data.qualifications || "",
        experience: data.experience || "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      })
    } else {
      setUser(newUser)
    }
    return newUser
  }, [users.length])

  const signOut = useCallback(() => {
    setUser(null)
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
