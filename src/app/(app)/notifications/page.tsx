"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { mockNotifications } from "../../../lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Bell, ArrowLeft, CheckCheck, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  if (!user) return null

  const userNotifications = notifications.filter((n) => n.userId === user.id)
  const unread = userNotifications.filter((n) => !n.read)
  const read = userNotifications.filter((n) => n.read)

  const filtered = activeTab === "all" ? userNotifications : activeTab === "unread" ? unread : read

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => n.userId === user.id ? { ...n, read: true } : n))
    toast.success("All notifications marked as read")
  }

  const deleteNotification = (id: number) => {
    const idx = notifications.findIndex((n) => n.id === id)
    if (idx !== -1) notifications.splice(idx, 1)
    setNotifications([...notifications])
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <Bell className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Notifications</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              {unread.length > 0 ? `${unread.length} unread` : "No unread notifications"}
            </p>
          </div>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-slide-up" style={{ animationDelay: "80ms" }}>
        <TabsList>
          <TabsTrigger value="all">All ({userNotifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({read.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {activeTab === "all" && "All Notifications"}
                {activeTab === "unread" && "Unread"}
                {activeTab === "read" && "Read"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors ${!n.read ? "bg-muted/20" : ""}`}
                    >
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${!n.read ? "bg-gold" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {new Date(n.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(n.id)} title="Mark as read">
                            <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteNotification(n.id)} title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}