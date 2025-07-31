"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { fetchFishImageBlob, logout } from "@/api/apiClient";
import { Box, Typography, Button } from "@mui/material";
import LoadingPage from '@/components/LoadingPage';

const HomePage = () => {
  const { user, loading, setUser, refreshUser } = useUser();
  const [fishImgUrl, setFishImgUrl]  = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setFishImgUrl(null);
      return;
    }

    const fetchFishImage = async () => {
      try {
        const blob = await fetchFishImageBlob(user.my_fish_path);
        if (blob) {
          const url = URL.createObjectURL(blob);
          setFishImgUrl(url);
        } else {
          setFishImgUrl(null);
        }
      } catch (error) {
        console.error("魚画像の取得に失敗しました", error);
        setFishImgUrl(null);
      }
    };

    fetchFishImage();

    return () => {
      if (fishImgUrl) {
        URL.revokeObjectURL(fishImgUrl);
      }
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    await refreshUser();
    router.replace('/login');
  }

  const handleGoToGenerate = async () => {
    router.push('/fish/generate');
  }

  if (loading) return <LoadingPage/>;

  return ( 
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {user ? `こんにちは、${user.user_id} さん` : "ログインしていません"}
      </Typography>
      {user && (
        <>
          {fishImgUrl ? (
            <Box
              component="img"
              src={fishImgUrl}
              alt="My Fish"
              sx={{ width: 300, height: 300, objectFit: "contain", mb: 2 }}
            />
          ) : (
            <Box
              sx={{
                width: 300,
                height: 300,
                mb: 2,
                border: "2px dashed gray", 
                borderRadius: 1,
              }}
            />
          )}

          <Button variant="outlined" color="primary" onClick={handleLogout}>
            ログアウト
          </Button>

          <Button variant="contained" color="primary" onClick={handleGoToGenerate}>
            魚を生成する
          </Button>
        </>
      )}
    </Box>
   );
}
 
export default HomePage;