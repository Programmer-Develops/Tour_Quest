import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Typography,
  Avatar,
  Button,
  Box,
  Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import tour from '../../images/tour.png';
import * as actionType from '../../constants/actionTypes';

const Navbar = () => {
  const { authData } = useSelector((state) => state.auth);
  const [user, setUser] = useState(authData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    dispatch({ type: actionType.LOGOUT });
    navigate('/auth');
  }, [dispatch, navigate]);

  // Sync user with Redux state
  useEffect(() => {
    setUser(authData);
  }, [authData]);

  // Check token expiration
  useEffect(() => {
    const token = user?.token;
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, [user?.token, logout]); // ← Only these deps

  return (
    <AppBar
      position="sticky"
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '0 10px', sm: '0 20px' },
        height: 64,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <Box component="img" src={tour} alt="Tour Quest" sx={{ height: 40, ml: { xs: 0, sm: 1 } }} />
      </Box>

      <Box>
        {user?.result ? (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pr: { xs: 0, sm: 2 } }}>
            <Avatar
              sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '1rem' }}
              alt={user.result.name}
              src={user.result.imageUrl}
            >
              {user.result.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
              {user.result.name}
            </Typography>
            <Button variant="contained" color="secondary" onClick={logout} size="small" sx={{ textTransform: 'none' }}>
              Logout
            </Button>
          </Stack>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary" size="small" sx={{ textTransform: 'none' }}>
            Sign In
          </Button>
        )}
      </Box>
    </AppBar>
  );
};

export default Navbar;