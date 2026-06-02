"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, User, Settings, X, Search, Menu } from "lucide-react"
import { useAuth } from "../lib/auth-context"
import { useData } from "../lib/data-context"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { toast } from "sonner"
import { useSidebar } from "./sidebar-provider"

export function TopNav() {
  const { user, signOut } = useAuth()
  const { notifications, courses } = useData()
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const unreadNotifications = notifications.filter((n) => n.userId === user?.id && !n.read)

  const searchResults = searchQuery.trim()
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  const handleSearchSelect = (courseId: number) => {
    setSearchOpen(false)
    setSearchQuery("")
    router.push(`/courses/${courseId}`)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false) }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const { toggle } = useSidebar()

  const handleSignOut = () => {
    signOut()
    toast.success("Signed out successfully")
    router.push("/signin")
  }

  return (
    <header className="h-14 border-b bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button onClick={toggle} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 max-w-sm hidden sm:block" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9 h-9 text-sm bg-muted/50 border-0 focus-visible:bg-background"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-card border rounded-xl shadow-dropdown z-50 animate-scale-in origin-top">
              {searchResults.map((course) => (
                <button
                  key={course.id}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handleSearchSelect(course.id)}
                >
                  <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{course.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted transition-all duration-200"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-xl shadow-dropdown z-50 animate-scale-in origin-top-right">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-sm font-semibold">Notifications</span>
                  <button onClick={() => setNotifOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {unreadNotifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No new notifications</p>
                  ) : (
                    unreadNotifications.map((n) => (
                      <button
                        key={n.id}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        onClick={() => {
                          setNotifOpen(false)
                          if (n.link) router.push(n.link)
                        }}
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-gold shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {new Date(n.date).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t px-4 py-2 flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs text-muted-foreground" onClick={() => { setNotifOpen(false); router.push("/notifications") }}>
                    View All
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted transition-all duration-200 rounded-lg">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-medium">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline">{user?.firstName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="w-4 h-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
