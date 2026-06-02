"use client"

import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../../../components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { useRouter } from "next/navigation"
import { EmptyState } from "../../../components/empty-state"
import { Plus, MoreVertical, Trash2, Ban, Play, UsersIcon, ArrowLeft, Upload, UserX } from "lucide-react"
import { toast } from "sonner"

export default function Users() {
  const { user: currentUser, users, setUsers } = useAuth()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false)
  const [csvText, setCsvText] = useState("")
  const [bulkResult, setBulkResult] = useState<{ success: number; errors: string[] } | null>(null)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "pass123",
    phone: "",
    idNumber: "",
    role: "Student",
    status: "Active",
  })

  if (!currentUser || currentUser.role !== "Admin") return <div className="p-6"><h1>Access denied</h1></div>

  const handleBulkImport = () => {
    if (!csvText.trim()) {
      toast.error("Please paste CSV data")
      return
    }
    const lines = csvText.trim().split("\n")
    let success = 0
    const errors: string[] = []
    const newUsers: typeof users = []
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(",").map((s) => s.trim())
      if (parts.length < 3) {
        errors.push(`Line ${i + 1}: Invalid format (need at least firstName,lastName,email)`)
        continue
      }
      const [firstName, lastName, email, role = "Student", status = "Active", phone = "", idNumber = ""] = parts
      if (!["Student", "Facilitator", "Admin"].includes(role)) {
        errors.push(`Line ${i + 1}: Invalid role "${role}"`)
        continue
      }
      const existing = users.find((u) => u.email === email)
      if (existing) {
        errors.push(`Line ${i + 1}: Email "${email}" already exists`)
        continue
      }
      newUsers.push({
        id: users.length + success + 1,
        firstName, lastName, email, password: "pass123",
        phone, idNumber,
        role: role as "Student" | "Facilitator" | "Admin",
        status: status as "Active" | "Suspended",
      })
      success++
    }
    if (newUsers.length > 0) {
      setUsers([...users, ...newUsers])
    }
    setBulkResult({ success, errors })
    if (errors.length === 0) {
      setIsBulkDialogOpen(false)
      setCsvText("")
      toast.success(`${success} user(s) imported successfully!`)
    }
  }

  const handleAddUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      toast.error("Name and email are required")
      return
    }
    const user = {
      id: users.length + 1,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      phone: newUser.phone,
      idNumber: newUser.idNumber,
      role: newUser.role as "Student" | "Facilitator" | "Admin",
      status: newUser.status as "Active" | "Suspended",
    }
    setUsers([...users, user])
    setIsDialogOpen(false)
    setNewUser({ firstName: "", lastName: "", email: "", password: "pass123", phone: "", idNumber: "", role: "Student", status: "Active" })
    toast.success("User added successfully")
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
    toast.success("User deleted")
  }

  const handleToggleStatus = (id: number) => {
    setUsers(users.map((u) =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" as const : "Active" as const } : u
    ))
    toast.success("User status updated")
  }

  const filteredUsers = users.filter((u) => {
    if (activeTab === "all") return true
    if (activeTab === "students") return u.role === "Student"
    if (activeTab === "facilitators") return u.role === "Facilitator"
    if (activeTab === "admins") return u.role === "Admin"
    return true
  })

  const counts = {
    all: users.length,
    students: users.filter((u) => u.role === "Student").length,
    facilitators: users.filter((u) => u.role === "Facilitator").length,
    admins: users.filter((u) => u.role === "Admin").length,
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1>Users Management</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">Manage all users in the system</p>
          </div>
        </div>
        <Dialog open={isBulkDialogOpen} onOpenChange={(o) => { setIsBulkDialogOpen(o); if (!o) setBulkResult(null) }}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Bulk Import
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Bulk Import Users</DialogTitle>
              <DialogDescription>Paste CSV data with columns: firstName, lastName, email, role, status, phone, idNumber</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                <p className="font-medium mb-1">Format:</p>
                <code className="block">John,Doe,john@example.com,Student,Active,0123456789,ID001</code>
                <code className="block">Jane,Smith,jane@example.com,Facilitator,Active,0123456790,ID002</code>
                <p className="mt-2">Only firstName, lastName, and email are required.</p>
              </div>
              <Textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Paste CSV data here..."
                rows={8}
              />
              {bulkResult && bulkResult.errors.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm font-medium text-destructive mb-1">Errors ({bulkResult.errors.length})</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {bulkResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              {bulkResult ? (
                <>
                  <Button variant="outline" onClick={() => { setIsBulkDialogOpen(false); setBulkResult(null); setCsvText("") }}>Done</Button>
                  <Button onClick={() => { setIsBulkDialogOpen(false); setBulkResult(null); setCsvText(""); toast.success(`${bulkResult.success} user(s) imported!`) }}>
                    Confirm ({bulkResult.success} imported)
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsBulkDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleBulkImport}>Import Users</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account for the LMS system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fname">First Name</Label>
                  <Input id="fname" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lname">Last Name</Label>
                  <Input id="lname" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} placeholder="Last name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Facilitator">Facilitator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Users ({counts.all})</TabsTrigger>
          <TabsTrigger value="students">Students ({counts.students})</TabsTrigger>
          <TabsTrigger value="facilitators">Facilitators ({counts.facilitators})</TabsTrigger>
          <TabsTrigger value="admins">Admins ({counts.admins})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-0 shadow-card card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {activeTab === "all" && "All Users"}
                {activeTab === "students" && "Students"}
                {activeTab === "facilitators" && "Facilitators"}
                {activeTab === "admins" && "Admins"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="py-3 px-6">User</TableHead>
                    <TableHead className="py-3 px-6">Email</TableHead>
                    <TableHead className="py-3 px-6">Role</TableHead>
                    <TableHead className="py-3 px-6">Status</TableHead>
                    <TableHead className="text-right py-3 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center text-xs font-medium">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          {u.firstName} {u.lastName}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-3 text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={u.role === "Admin" ? "default" : u.role === "Facilitator" ? "secondary" : "outline"}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          className={`${u.status === "Active" ? "bg-success text-white hover:bg-success/90" : "bg-warning text-white hover:bg-warning/90"} border-0`}
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleToggleStatus(u.id)}>
                              {u.status === "Active" ? <><Ban className="w-4 h-4 mr-2" /> Suspend</> : <><Play className="w-4 h-4 mr-2" /> Activate</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(u.id)} className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredUsers.length === 0 && (
                <div className="p-8">
                  <EmptyState
                    icon={<UserX className="w-12 h-12 text-muted-foreground" />}
                    title="No users found"
                    description={activeTab === "all" ? "No users in the system yet." : `No ${activeTab.replace("s$", "")} found.`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
