import dynamic from "next/dynamic"
import { TopNav } from "../../components/top-nav"
import { Sidebar } from "../../components/sidebar"
import { AuthGuard } from "../../components/auth-guard"
import { SidebarProvider } from "../../components/sidebar-provider"
import { DataProvider } from "../../lib/data-context"

const ChatBot = dynamic(() => import("../../components/chatbot").then((m) => ({ default: m.ChatBot })))

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DataProvider>
      <SidebarProvider>
        <div className="min-h-full flex">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <TopNav />
            <main className="flex-1 bg-background">
              {children}
            </main>
          </div>
        </div>
        <ChatBot />
      </SidebarProvider>
      </DataProvider>
    </AuthGuard>
  )
}
