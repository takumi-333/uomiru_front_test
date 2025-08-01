"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkLogin, logout } from "@/api/apiClient"
import LoadingPage from "@/components/LoadingPage"
import { AppBar, Typography, Button, Box, Container, Toolbar } from "@mui/material"
import { useUser } from "@/contexts/UserContext"
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, refreshUser } = useUser();
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    await logout();
    await refreshUser();
    router.replace('/login');
  }

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
  }, [router, refreshUser])

  if (loading) return <LoadingPage />

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1}}>
            <Typography variant="h6">ウオミル</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
            <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </Button>
            <PersonIcon />
            <Typography>{user? `${user.user_id} さん` : ""}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 1 }}>
        {children}
      </Container>
    </>
  )
}
