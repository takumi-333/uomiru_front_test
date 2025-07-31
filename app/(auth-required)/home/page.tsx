"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/apiClient";
import { Box, Typography, Button } from "@mui/material";

const HomePage = () => {
  const { user, setUser } = useUser();
  const [fishImgUrl, setFishImgUrl]  = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setFishImgUrl(null);
      return;
    }

    // fish APIのpathパラメータはuserオブジェクトの持つパスに合わせて変更してください
    const fetchFishImage = async () => {
      try {
        if (!user.my_fish_path) {
          setFishImgUrl(null);
          return;
        }
        const response = await fetch(`http://localhost:5000/fish?path=${encodeURIComponent(user.my_fish_path)}`);

        if (response.status === 204) {
          // 画像なし
          setFishImgUrl(null);
        } else if (response.ok) {
          // Blobに変換してURL作成
          const blob = await response.blob();
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

    // クリーンアップでURLを解放
    return () => {
      if (fishImgUrl) {
        URL.revokeObjectURL(fishImgUrl);
      }
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.replace('/login');
  }

  const handleGoToGenerate = async () => {
    router.push('/fish/generate');
  }

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