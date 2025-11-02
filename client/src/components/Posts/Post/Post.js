import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
  Box,
} from '@mui/material';
import {
  ThumbUpAlt as ThumbUpAltIcon,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { likePost, deletePost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user?.result?.googleId || user?.result?._id;

  // SAFE: Always an array
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const hasLiked = likes.includes(userId);

  const handleLike = () => {
    if (user?.token) {
      dispatch(likePost(post._id));
    }
  };

  const Likes = () => {
    if (likes.length > 0) {
      return hasLiked ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }
    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: '0.3s',
        '&:hover': { boxShadow: 6 },
      }}
      raised
      elevation={6}
    >
      <ButtonBase
        onClick={openPost}
        sx={{ display: 'block', textAlign: 'initial', width: '100%' }}
      >
        <CardMedia
          image={
            post.selectedFile ||
            'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'
          }
          alt={post.title}
          sx={{
            height: 0,
            paddingTop: '56.25%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backgroundBlendMode: 'darken',
          }}
        />

        <Box sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>

        {userId === post?.creator && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentId(post._id);
              }}
              size="small"
              sx={{ color: 'white' }}
            >
              <MoreHorizIcon fontSize="medium" />
            </Button>
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {post.tags?.map((tag) => `#${tag} `)}
          </Typography>
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ px: 2, mt: -1, fontWeight: 600, color: 'text.primary' }}
        >
          {post.title}
        </Typography>

        <CardContent sx={{ pt: 0, pb: 1, flexGrow: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {post.message}
          </Typography>
        </CardContent>
      </ButtonBase>

      <CardActions sx={{ px: 2, pb: 2, pt: 1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={handleLike}
        >
          <Likes />
        </Button>

        {userId === post?.creator && (
          <Button
            size="small"
            color="secondary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" /> Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;