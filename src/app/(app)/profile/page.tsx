"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import { User, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  if (!user) return null

  const handleSave = () => {
    updateUser({ ...user, ...form })
    setEditing(false)
    toast.success("Profile updated successfully")
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 animate-slide-up">
        <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
          <User className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1>Profile</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Manage your personal information</p>
        </div>
      </div>

      <Card className="border-0 shadow-card animate-slide-up" style={{ animationDelay: "80ms" }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-gold text-black text-lg">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{user.firstName} {user.lastName}</CardTitle>
              <CardDescription>{user.role} &middot; {user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} disabled={!editing} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} disabled={!editing} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!editing} type="email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} disabled={!editing} />
          </div>
          <div className="space-y-2">
            <Label>ID Number</Label>
            <Input value={user.idNumber} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={user.role} disabled />
          </div>
          <div className="flex gap-3 pt-2">
            {editing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
