"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import LoadingPage from '@/components/LoadingPage';
import { Aquarium } from './Aquarium';

const HomePage = () => {
  const { user, loading, fishUrl } = useUser();
  const router = useRouter();

  const handleGoToGenerate = async () => {
    router.push('/fish/generate');
  }

  const handleGoToEvolve = async () => {
    router.push('/fish/evolve');
  }

  if (loading) return <LoadingPage/>;

  return ( 
    <Box sx={{ p: 1 }}>
        <Aquarium fishImgUrl={fishUrl} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 2}}>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleGoToGenerate}
            disabled={!user || (fishUrl !== null && fishUrl !== "")}
            sx={{ width: '150px', height: '100px' }}
          >
            魚を生成する
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={handleGoToEvolve}
            disabled={!user || !fishUrl}
            sx={{ width: '150px', height: '100px' }}
          >
            魚を育成する
          </Button>
          <Button 
            variant="contained"
            color="primary"
            onClick={() => {}}
            disabled={!user || !fishUrl}
            sx={{ width: '150px', height: '100px' }}
          >
            魚を鑑賞する
          </Button>
        </Box>
    </Box>
   );
}
 
export default HomePage;