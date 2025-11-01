// src/pages/Home/Home.js
import React, { useState } from 'react';
import {
  Container,
  Grow,
  Grid,
  AppBar,
  TextField,
  Button,
  Paper,
  Autocomplete,
  Chip,
  Stack,
  Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const query = useQuery();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState(null);
  const { authData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

  const searchPost = () => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      navigate(
        `/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`
      );
    } else {
      navigate('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') searchPost();
  };

  return (
    <Grow in>
      <Container maxWidth="xl">
        {/* Full-height wrapper so the sidebar stretches to the bottom */}
        <Grid
          container
          spacing={3}
          sx={{
            flexDirection: { xs: 'column-reverse', md: 'row' },
            minHeight: 'calc(100vh - 64px)', // 64px = navbar height
          }}
        >
          {/* ---------- Posts ---------- */}
          <Grid item xs={12} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>

          {/* ---------- Sidebar ---------- */}
          <Grid item xs={12} md={3}>
            <Stack
              spacing={3}
              sx={{
                height: '100%',               // fill the grid cell
                justifyContent: 'flex-start', // keep everything at top
              }}
            >
              <AppBar
                position="sticky"
                color="inherit"
                sx={{
                  top: 0,
                  borderRadius: 3,
                  p: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                }}
              >
                <TextField
                  name="search"
                  variant="outlined"
                  label="Search guides"
                  fullWidth
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyPress}
                />

                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={tags}
                  onChange={(_, v) => setTags(v)}
                  renderTags={(value, getTagProps) =>
                    value.map((opt, i) => (
                      <Chip
                        key={i}
                        label={opt}
                        size="small"
                        color="primary"
                        {...getTagProps({ i })}
                        sx={{ mr: 0.5 }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Search Tags"
                      placeholder="Press Enter to add"
                      fullWidth
                      size="small"
                      sx={{ mt: 2 }}
                    />
                  )}
                />

                <Button
                  onClick={searchPost}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Search
                </Button>
              </AppBar>

              {authData && (
                <Form currentId={currentId} setCurrentId={setCurrentId} />
              )}

              <Box sx={{ mt: 'auto' }}>
                {!searchQuery && tags.length === 0 && (
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: 3,
                      p: 1,
                      bgcolor: 'background.paper',
                    }}
                  >
                    <Pagination page={page} />
                  </Paper>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;