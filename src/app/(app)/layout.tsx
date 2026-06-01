import { TopNav } from "../../components/top-nav"
import { Sidebar } from "../../components/sidebar"
import { AuthGuard } from "../../components/auth-guard"
import { ChatBot } from "../../components/chatbot"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 bg-background">
            {children}
          </main>
        </div>
      </div>
      <ChatBot />
    </AuthGuard>
  )
}
