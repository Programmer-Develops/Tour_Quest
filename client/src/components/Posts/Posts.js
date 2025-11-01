import React from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts?.length && !isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6">No posts yet.</Typography>
      </Box>
    );
  }

  return isLoading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Grid
      container
      spacing={3}
      sx={{
        mt: 2,
        justifyContent: { xs: 'center', md: 'flex-start' },
      }}
    >
      {posts.map((post) => (
        <Grid
          key={post._id}
          item
          xs={12}
          sm={6}
          md={6}
          lg={4}
          xl={3}
          sx={{
            display: 'flex',
          }}
        >
          <Post post={post} setCurrentId={setCurrentId} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;