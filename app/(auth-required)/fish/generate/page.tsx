'use client';

import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function GenerateFishPage() {
  const [color, setColor] = useState('');
  const [shape, setShape] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fishImageUrl, setFishImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setFishImageUrl(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/fish/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // セッション管理があるなら
        body: JSON.stringify({
          ans: { color, shape },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || '生成失敗');
        setLoading(false);
        return;
      }

      // バイナリデータとして画像を受け取る
      const blob = await response.blob();
      // BlobからURL作成
      const url = URL.createObjectURL(blob);
      setFishImageUrl(url);
      setLoading(false);
    } catch (e) {
      setError('通信エラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        魚の特徴を入力して生成
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField
          label="魚の色"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          fullWidth
        />
        <TextField
          label="魚の形"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={loading || !color || !shape}
        >
          {loading ? <CircularProgress size={24} /> : '生成'}
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {fishImageUrl && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" gutterBottom>
            生成された魚
          </Typography>
          <img
            src={fishImageUrl}
            alt="Generated Fish"
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
        </Box>
      )}
    </Container>
  );
}
