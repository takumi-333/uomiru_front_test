'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CardMedia, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { fetchFeeds } from '@/api/apiClient';
import LoadingPage from '@/components/LoadingPage';

type Feed = {
  name: string;
  feature: string;
  img_path: string;
};

const EvolovePage = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);

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
          <CardMedia 
            component="img"
            src={selectedFeed?.img_path ? `http://localhost:5000/feeds/image?path=${encodeURIComponent(selectedFeed.img_path)}` : ''}
            alt={selectedFeed?.name}
            sx={{ maxWidth: '100%', maxHeight: '300px', margin: 'auto', borderRadius: 2 }}
          />
          <Typography variant="body1" sx={{ mt: 2}}>
            {selectedFeed?.feature}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mb: 2}}>
          <Button variant="contained" color="primary" onClick={()=>{}}>
            えさにする
          </Button>
          <Button variant='outlined' onClick={handleCloseDialog}>
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
   );
}
 
export default EvolovePage;