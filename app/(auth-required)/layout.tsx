"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/api/apiClient"
import LoadingPage from "@/components/LoadingPage"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      const loggedIn = await checkLogin()
      if (!loggedIn) {
        router.replace("/login")
      } else {
        setLoading(false)
      }
    }
    verify()
  }, [router])

  if (loading) return <LoadingPage />

  return <>{children}</>
}
