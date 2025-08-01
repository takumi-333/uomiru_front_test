'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CardMedia, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button,CircularProgress } from '@mui/material';
import { evolveFish, fetchFeeds } from '@/api/apiClient';
import LoadingPage from '@/components/LoadingPage';
import { useUser } from "@/contexts/UserContext";
import { useRouter } from 'next/navigation';

type Feed = {
  id: string;
  name: string;
  feature: string;
  img_path: string;
};

const EvolovePage = () => {
  const { refreshUser } = useUser();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [newfishImgUrl, setNewFishImgUrl]  = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'merge' | 'loading' | 'result'>('select');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchFeeds();
        setFeeds(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingPage/>

  const handleOpenDialog = (feed: Feed) => {
    setSelectedFeed(feed);
    setOpen(true);
  }

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedFeed(null);
  }
  
  const handleGoToHome = () => {
    router.push('/home');
  }

  const handleEvolve = async () => {
    if (!selectedFeed) return;
    setStep('loading');
    try {
      const blob = await evolveFish(selectedFeed.id);
      refreshUser();
      const url = URL.createObjectURL(blob);
      setNewFishImgUrl(url);
      setStep('result');
    } catch (error) {
      console.error(error);
      setStep('select');
    } 
  }

  return ( 
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>えさ一覧</Typography>
      <Grid container spacing={2} sx={{ width: '100%', m: 0}} justifyContent="flex-start">
        {feeds.map((feed, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg:3}} key={`feed-${index}`} component="div">
            <Paper 
              sx={{ width: '100%', cursor: 'pointer'}}
              onClick={()=> handleOpenDialog(feed)}
              elevation={3}
            >
              <CardMedia
                component="img"
                width="90%"
                image={`http://localhost:5000/feeds/image?path=${encodeURIComponent(feed.img_path)}`}
                alt={feed.name}
              />
              <CardContent>
                <Typography variant="h6">{feed.name}</Typography>
              </CardContent>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        maxWidth='lg'
      >
        <DialogTitle id="feed-dialog-title">{selectedFeed?.name}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center'}}>
          { step === 'select' && selectedFeed && (
          <>
            <CardMedia 
              component="img"
              src={selectedFeed?.img_path ? `http://localhost:5000/feeds/image?path=${encodeURIComponent(selectedFeed.img_path)}` : ''}
              alt={selectedFeed?.name}
              sx={{ maxWidth: '100%', maxHeight: '300px', margin: 'auto', borderRadius: 2 }}
            />
            <Typography variant="body1" sx={{ mt: 2}}>
              {selectedFeed?.feature}
            </Typography>
          </>
          )}

          { step === 'loading' && (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems:'center'}}>
              <CircularProgress size={30}/>
            </Box> 
          )}

          { step  === 'result' && (
            <>
              <CardMedia component="img" src={newfishImgUrl? newfishImgUrl: ''} sx={{ maxWidth: 300, borderRadius: 2 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>新しい魚が生まれました！</Typography>
            </>
          )}
          
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 2}}>
          { (step === 'select' || step === 'loading') && (
            <>
              <Button variant="contained" color="primary" disabled={step==='loading'} onClick={handleEvolve}>
                えさにする
              </Button>
              <Button variant='outlined' disabled={step==='loading'} onClick={handleCloseDialog}>
                キャンセル
              </Button>
            </>
          )}

          { step === 'result' && (
            <Button variant = "contained" onClick={handleGoToHome}>
              この魚で決定
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
   );
}
 
export default EvolovePage;