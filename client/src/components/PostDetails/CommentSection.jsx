import React, { useState, useRef } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Divider,
} from '@mui/material';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../actions/posts';

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [comment, setComment] = useState('');
  // 1. We use a local state to store and show the comments.
  const [comments, setComments] = useState(post?.comments || []);
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleComment = async () => {
    if (!comment.trim() || !user) return;

    const finalComment = `${user?.result?.name}: ${comment}`;
    
    try {
      const newComments = await dispatch(commentPost(finalComment, post._id));

      if (newComments) {
        setComments(newComments);
        setComment(''); 
      }
      
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

    } catch (error) {
      console.log("Error in handleComment:", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          mt: 2,
        }}
      >
        <Box sx={{ flex: 1, maxHeight: 400, overflow: 'auto', pr: 1 }}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {comments.map((c, i) => {
              const [author, ...messageParts] = c.split(': ');
              const message = messageParts.join(': ');
              return (
                <Box
                  key={i}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  <Typography variant="subtitle1" component="span" fontWeight="bold">
                    {author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {message}
                  </Typography>
                </Box>
              );
            })}
            <div ref={commentsRef} />
          </Stack>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <Typography gutterBottom variant="h6">
            Write a comment
          </Typography>

          {user?.result?.name ? (
            <>
              <TextField
                fullWidth
                rows={4}
                variant="outlined"
                label="Comment"
                multiline
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                disabled={!comment.trim()}
                color="primary"
                variant="contained"
                onClick={handleComment}
              >
                Comment
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Please sign in to write a comment.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CommentSection;