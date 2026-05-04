"use client"

import { useEffect, useState } from "react"
import { authApi, ApiError, type AuthUser } from "@/lib/api"

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    authApi.me()
      .then(setUser)
      .catch((err: ApiError) => {
        if (err.status === 401) window.location.href = "/auth/sign-in"
      })
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Olá{user ? `, ${user.name}` : ""}! 👋
      </h1>
      <p className="text-gray-500">
        Dashboard em construção. Login e registro funcionando.
      </p>
    </div>
  )
}
