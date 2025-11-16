import React, { useEffect } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Box,
  Link,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { getPost, getPostsBySearch } from '../../actions/posts';
import CommentSection from './CommentSection';
const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: 'none', tags: post?.tags?.join(',') })
      );
    }
  }, [post, dispatch]);

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const openPost = (_id) => navigate(`/posts/${_id}`);

  const recommendedPosts = posts?.filter(({ _id }) => _id !== post._id);

  return (
    <Paper sx={{ padding: { xs: 2, sm: 3 }, borderRadius: 4 }} elevation={6}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            {post.title}
          </Typography>

          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags?.map((tag) => (
              <Link
                key={tag}
                component={RouterLink}
                to={`/tags/${tag}`}
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                {` #${tag} `}
              </Link>
            ))}
          </Typography>

          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Created by:{' '}
            <Link
              component={RouterLink}
              to={`/creators/${post.name}`}
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              {post.name}
            </Link>
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {moment(post.createdAt).fromNow()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1">
            <strong>Realtime Chat - coming soon!</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <CommentSection post={post} />

          <Divider sx={{ my: 2 }} />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src={
              post.selectedFile ||
              'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
            }
            alt={post.title}
            sx={{
              borderRadius: 2,
              maxWidth: '100%',
              height: 'auto',
              maxHeight: 500,
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>

      {!!recommendedPosts?.length && (
        <Box sx={{ mt: 4 }}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 2,
            }}
          >
            {recommendedPosts.map(
              ({ title, name, message, likes, selectedFile, _id }) => (
                <Box
                  key={_id}
                  onClick={() => openPost(_id)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': { boxShadow: 3 },
                  }}
                >
                  <Typography gutterBottom variant="h6">
                    {title}
                  </Typography>
                  <Typography gutterBottom variant="subtitle2">
                    {name}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {message}
                  </Typography>
                  <Typography variant="subtitle1">
                    Likes: {likes?.length || 0}
                  </Typography>
                  {selectedFile && (
                    <Box
                      component="img"
                      src={selectedFile}
                      alt={title}
                      sx={{
                        mt: 1,
                        width: '100%',
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </Box>
              )
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default PostDetails;