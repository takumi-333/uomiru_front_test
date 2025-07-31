'use client';

import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { generateFish } from '@/api/apiClient';

export default function GenerateFishPage() {
  const { refreshUser } = useUser();
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
      const blob = await generateFish(color, shape);
      refreshUser();
      const url = URL.createObjectURL(blob);
      setFishImageUrl(url);
      setLoading(false);
    } catch (e: any) {
      setError(e.message || '通信エラーが発生しました');
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
