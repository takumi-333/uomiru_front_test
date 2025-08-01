"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { fetchFishImageBlob } from "@/api/apiClient";
import { Box, Button } from "@mui/material";
import LoadingPage from '@/components/LoadingPage';
import { Aquarium } from './Aquarium';

const HomePage = () => {
  const { user, loading } = useUser();
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

  const handleGoToGenerate = async () => {
    router.push('/fish/generate');
  }

  const handleGoToEvolve = async () => {
    router.push('/fish/evolve');
  }

  if (loading) return <LoadingPage/>;

  return ( 
    <Box sx={{ p: 1 }}>
        <Aquarium fishImgUrl={fishImgUrl} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 2}}>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleGoToGenerate}
            // disabled={!user || fishImgUrl !== ""}
            disabled={!user}
          >
            魚を生成する
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleGoToEvolve}
            disabled={!user || !fishImgUrl}
          >
            魚を育成する
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => {}}
            disabled={!user || !fishImgUrl}
          >
            魚を鑑賞する
          </Button>
        </Box>
    </Box>
   );
}
 
export default HomePage;