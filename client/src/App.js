import React from 'react';
import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ← ADD THIS

import PostDetails from './components/PostDetails/PostDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';

const App = () => {
  const { authData } = useSelector((state) => state.auth); // ← READ FROM REDUX

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Routes>
          {/* Redirect root to /posts */}
          <Route path="/" element={<Navigate to="/posts" replace />} />

          {/* Home page */}
          <Route path="/posts" element={<Home />} />
          <Route path="/posts/search" element={<Home />} />

          {/* Post Details */}
          <Route path="/posts/:id" element={<PostDetails />} />

          {/* Creator or Tag page */}
          <Route path="/creators/:name" element={<CreatorOrTag />} />
          <Route path="/tags/:name" element={<CreatorOrTag />} />

          {/* Auth Guard */}
          <Route
            path="/auth"
            element={authData ? <Navigate to="/posts" replace /> : <Auth />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;