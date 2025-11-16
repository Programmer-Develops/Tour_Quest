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
  ThumbUpAltOutlined,
  Delete as DeleteIcon,
  MoreHoriz as MoreHorizIcon,
  Help as HelpIcon,
  HelpOutline as HelpOutlineIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { likePost, deletePost, helpfulPost } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));

  const userId = user?.result?.googleId || user?.result?._id;
  const isLoggedIn = !!user?.result; 

  const likes = Array.isArray(post.likes) ? post.likes : [];
  const hasLiked = isLoggedIn && likes.includes(userId);

  const helpfuls = Array.isArray(post.helpful) ? post.helpful : [];
  const hasFoundHelpful = isLoggedIn && helpfuls.includes(userId);

  const isOwner = isLoggedIn && userId === post?.creator;

  const handleLike = () => {
    if (isLoggedIn) {
      dispatch(likePost(post._id));
    }
  };

  const handleHelpful = () => {
    if (isLoggedIn) {
      dispatch(helpfulPost(post._id));
    }
  };

  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };

  const Likes = () => {
    if (likes.length > 0) {
      return hasLiked ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
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

  const Helpfuls = () => {
    if (helpfuls.length === 0) {
      return (
        <>
          <HelpOutlineIcon fontSize="small" />
          &nbsp;Helpful
        </>
      );
    }

    const Icon = hasFoundHelpful ? HelpIcon : HelpOutlineIcon;
    
    const text = helpfuls.length === 1 
                   ? '1 person found this helpful' 
                   : `${helpfuls.length} people found this helpful`;

    return (
      <>
        <Icon fontSize="small" />
        &nbsp;{text}
      </>
    );
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

        {isOwner && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Don't trigger openPost
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

      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box> 
          <Button
            size="small"
            color="primary"
            disabled={!isLoggedIn}
            onClick={handleLike}
          >
            <Likes />
          </Button>

          <Button
            size="small"
            color="primary"
            disabled={!isLoggedIn}
            onClick={handleHelpful}
          >
            <Helpfuls />
          </Button>
        </Box>

        {isOwner && (
          <Button
            size="small"
            color="secondary"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" /> &nbsp;Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;