import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { likePost, deletePost } from '../../../actions/posts';
// import { debounce } from '../../../utils/debounce';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  // Update local state when post data changes
  useEffect(() => {
    setIsLiked(post.isLiked || false);
    setLikeCount(post.likeCount || 0);
  }, [post.isLiked, post.likeCount]);

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
      <div className={classes.overlay}>
        <Typography variant="h6">{post.creator}</Typography>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      <div className={classes.overlay2}>
        <Button style={{ color: 'white' }} size="small" onClick={() => setCurrentId(post._id)}><MoreHorizIcon fontSize="default" /></Button>
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
      </div>
      <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button 
          size="small" 
          color={isLiked ? "secondary" : "primary"}
          onClick={() => {
            setIsLiked(!isLiked);
            setLikeCount(current => isLiked ? 0 : 1);
            dispatch(likePost(post._id));
          }}
        >
          <ThumbUpAltIcon fontSize="small" /> {isLiked ? 'Liked' : 'Like'} {likeCount}
        </Button>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              dispatch(deletePost(post._id));
            }
          }}
        >
          <DeleteIcon fontSize="small" /> Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default Post;
