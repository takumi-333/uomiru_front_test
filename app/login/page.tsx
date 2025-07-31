'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkLogin } from '@/lib/apiClient';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';

export default function Home() {
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

  // 本当はファイル切り離す
  const handleLogin = async () => {
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: userId,
          password: password,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(result.message || 'ログイン成功');
        router.replace("/home");
      } else {
        setError(result.error || 'ログイン失敗');
      }
    } catch (err) {
      console.error(err);
      setError('通信エラーが発生しました');
    }
  };

  const handleGoToRegister = () => {
    router.push('/register');
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        ログイン
      </Typography>
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
