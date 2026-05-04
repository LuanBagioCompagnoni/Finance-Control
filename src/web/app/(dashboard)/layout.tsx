"use client"

import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await authApi.logout().catch(() => {})
    router.push("/auth/sign-in")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm">
        <span className="font-bold text-lg" style={{ color: "#0C115B" }}>
          Finance Control
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Sair
        </button>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
