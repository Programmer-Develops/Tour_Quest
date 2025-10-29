import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import Grow from '@mui/material/Grow';
import { useDispatch } from 'react-redux';

import Posts from './components/Posts/Posts';
import Form from './components/Form/Form';
import { getPosts } from './actions/posts';
import { StyledAppBar, StyledHeading, StyledImage } from './styles';
import tour from './images/tour.png';

const App = () => {
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [currentId, dispatch]);

  return (
    <Container maxWidth="lg">
      <StyledAppBar position="static" color="inherit">
        <StyledHeading variant="h2" align="center">Tour Quest</StyledHeading>
        <StyledImage src={tour} alt="icon" height="60" />
      </StyledAppBar>
      <Grow in>
        <Container>
          <Grid container justify="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={4}>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={7}>
              <Posts setCurrentId={setCurrentId} />
            </Grid>
          </Grid>
        </Container>  
      </Grow>
    </Container>
  );
};

export default App;
