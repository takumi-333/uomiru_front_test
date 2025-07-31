"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkLogin } from "@/api/apiClient"
import LoadingPage from "@/components/LoadingPage"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      const loggedIn = await checkLogin()
      router.replace(loggedIn ? "/home" : "/login")
    }
    verify()
  }, [router])

  return <LoadingPage/>
}