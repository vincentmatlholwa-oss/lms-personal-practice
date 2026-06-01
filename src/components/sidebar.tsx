"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, BookOpen, Users, Megaphone, Settings, Calendar,
  BookOpenCheck, HelpCircle, FileText, UserCheck,
  UserPlus, LogOut, Bell, BarChart3, Award,
} from "lucide-react"
import { MdihubLogo } from "./mdihub-logo"
import { cn } from "../lib/utils"
import { useAuth } from "../lib/auth-context"
import { mockNotifications, mockFacilitatorApplications } from "../lib/mock-data"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const role = user?.role

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/my-courses", label: "My Courses", icon: BookOpenCheck, roles: ["Student"] },
    { path: "/courses", label: "Courses", icon: BookOpen, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/calendar", label: "Calendar", icon: Calendar, roles: ["Student", "Facilitator"] },
    { path: "/announcements", label: "Announcements", icon: Megaphone, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/notifications", label: "Notifications", icon: Bell, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/analytics", label: "Analytics", icon: BarChart3, roles: ["Admin"] },
    { path: "/facilitator/applications", label: "Pending Approvals", icon: UserPlus, roles: ["Admin"] },
    { path: "/users", label: "Users", icon: Users, roles: ["Admin"] },
    { path: "/study-guides", label: "Study Guides", icon: FileText, roles: ["Student"] },
    { path: "/certificates", label: "Certificates", icon: Award, roles: ["Student"] },
    { path: "/profile", label: "Profile", icon: UserCheck, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/settings", label: "Settings", icon: Settings, roles: ["Student", "Facilitator", "Admin"] },
    { path: "/help", label: "Help", icon: HelpCircle, roles: ["Student", "Facilitator", "Admin"] },
  ]

  const filtered = navItems.filter((item) => item.roles.includes(role || "Student"))

  const unreadCount = mockNotifications.filter((n) => n.userId === user?.id && !n.read).length
  const pendingCount = mockFacilitatorApplications.filter((a) => a.status === "Pending").length

  const getBadge = (path: string): number | null => {
    if (path === "/announcements" && unreadCount > 0) return unreadCount
    if (path === "/facilitator/applications" && pendingCount > 0) return pendingCount
    return null
  }

  const handleSignOut = () => {
    signOut()
    toast.success("Signed out successfully")
    router.push("/signin")
  }

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <MdihubLogo width={36} height={36} />
          <div>
            <h1 className="text-sidebar-foreground text-sm font-semibold tracking-tight">MDiHub</h1>
            <p className="text-[10px] text-sidebar-foreground/40 tracking-wider uppercase">Learning Platform</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {filtered.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/")

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-all duration-200", isActive && "text-gold")} />
              <span className="flex-1">{item.label}</span>
              {(() => {
                const badge = getBadge(item.path)
                return badge !== null ? (
                  <span className="w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                ) : null
              })()}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gold/20 text-gold text-xs font-medium">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground/80">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-[11px] text-sidebar-foreground/40 truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
