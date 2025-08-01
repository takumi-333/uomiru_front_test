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
import { useRouter } from 'next/navigation';

export default function GenerateFishPage() {
  const router = useRouter();
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

  const handleGoToHome = () => {
    router.replace('/home');
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        { !loading && !fishImageUrl && (
          <>
            <Typography variant='h5' gutterBottom>
              あなたの思い描く魚の特徴を教えてください!
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mb={2}>
              <Box sx={{ display:  'flex', alignItems: 'center', gap: 4}}>
                <Typography variant="h6" sx={{ width: 200 }}>魚の色は？</Typography>
                <TextField
                  placeholder='淡い赤色'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>
              <Box sx={{ display:  'flex', alignItems: 'center', gap: 4}}>
                <Typography variant="h6" sx={{ width: 200 }}>魚のかたちは？</Typography>
                <TextField
                  placeholder='三角形'
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>
          </>
        )}
        { loading && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              生成された魚
            </Typography>
            <Box sx={{ width: 400, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CircularProgress size={120} /> 
            </Box>
          </Box>
        )}
        { fishImageUrl && fishImageUrl !== "" && (
          <Box mt={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              生成された魚
            </Typography>
            <img
              src={fishImageUrl}
              alt="Generated Fish"
              style={{ width: 400, borderRadius: 8 }}
            />
        </Box>
        )}
        { !fishImageUrl || fishImageUrl === "" ? (
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading || !color || !shape}
            >
              生成
            </Button>
          ): (
            <Button
              variant="contained"
              onClick={handleGoToHome}
              disabled={loading}
            >
              この魚に決定する
            </Button>
          )
        }
        
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

    </Container>
  );
}
