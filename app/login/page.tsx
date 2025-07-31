'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { checkLogin, login } from '@/api/apiClient';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import Image from 'next/image';

export default function Home() {
  const { refreshUser } = useUser();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() =>{
    const verify = async()=> {
      const loggedIn= await checkLogin();
      if (loggedIn){
        router.replace("/home");
      }
    }
    verify();
  }, [router]);

  const handleLogin = async () => {
    setMessage(null);
    setError(null);

    try {
      const result = await login(userId, password);
      if (result.ok) {
        setMessage(result.data.message || 'ログイン成功');
        await refreshUser();
        router.replace("/home");
      } else {
        setError(result.data.error || 'ログイン失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '通信エラーが発生しました');
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h1" align="center" gutterBottom sx={{ color: 'blue' }}>
        ウオミル
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Image
          src="/logo.png"
          alt="ウオミル ロゴ"
          width={150}
          height={150}
          priority
        />
      </Box>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="ユーザーID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
        />
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          ログイン
        </Button>
        <Button variant="text" color="secondary" onClick={handleGoToRegister}>
          アカウントをお持ちでない方はこちら
        </Button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
}
