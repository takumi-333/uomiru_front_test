"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { fetchFishImageBlob } from "@/api/apiClient";
import { Box, Typography, Button } from "@mui/material";
import LoadingPage from '@/components/LoadingPage';
import { Aquarium } from './Aquarium';

const HomePage = () => {
  const { user, loading } = useUser();
  const [fishImgUrl, setFishImgUrl]  = useState<string | null>(null);
  console.log(fishImgUrl)
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

  const handleGoToGenerate = async () => {
    router.push('/fish/generate');
  }

  if (loading) return <LoadingPage/>;

  return ( 
    <Box sx={{ p: 4 }}>
        <>
          <Aquarium fishImgUrl={fishImgUrl} />
          <Button variant="contained" color="primary" onClick={handleGoToGenerate}>
            魚を生成する
          </Button>
        </>
    </Box>
   );
}
 
export default HomePage;