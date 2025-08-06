'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';


// 画面遷移せず、UXがかなり悪い、要修正

export default function RegisterPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(result.message || '登録成功');
        router.push('/login');
      } else {
        setError(result.error || '登録失敗');
      }
    } catch (err) {
      console.error(err);
      setError('通信エラーが発生しました');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        新規登録
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
        <Button variant="contained" color="primary" onClick={handleRegister}>
          登録する
        </Button>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Container>
  );
}
