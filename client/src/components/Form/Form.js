import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Autocomplete,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useNavigate } from 'react-router-dom';

import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    title: '',
    message: '',
    tags: [],
    selectedFile: '',
  });

  const post = useSelector((state) =>
    currentId
      ? state.posts.posts.find((p) => p._id === currentId)
      : null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));

  const clear = () => {
    setCurrentId(null);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  // THIS IS THE NEW, CORRECT CODE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      // Also add the name to updated posts
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
    } else {
      // Add the user's name when creating a post
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
    }
    clear();
  };

  if (!user?.result?.name) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
        elevation={6}
      >
        <Typography variant="h6" color="text.secondary">
          Please Sign In to create your tour guides and like other's tour guides.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
      elevation={6}
    >
      <Box
        component="form"
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {currentId ? `Editing "${post?.title}"` : 'Creating a guide'}
        </Typography>

        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) =>
            setPostData({ ...postData, title: e.target.value })
          }
          size="small"
        />

        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
          size="small"
        />

        {/* Tags Input */}
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={postData.tags}
          onChange={(event, newValue) => {
            setPostData({ ...postData, tags: newValue });
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                // key={index}
                label={option}
                size="small"
                color="primary"
                {...getTagProps({ index })}
                sx={{ mr: 0.5 }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Type tag and press Enter..."
              fullWidth
              size="small"
            />
          )}
        />

        {/* File Upload */}
        <Box
          sx={{
            p: 2,
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'grey.50',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'grey.100',
            },
          }}
        >
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </Box>

        {/* Buttons */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            fullWidth
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={clear}
            fullWidth
          >
            Clear
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default Form;