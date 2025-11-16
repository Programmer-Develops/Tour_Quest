import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  Box,
  Stack,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from 'jwt-decode';
import { signin, signup } from '../../actions/auth';
import { AUTH } from '../../constants/actionTypes';
import Input from './Input';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prev) => !prev);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(form, navigate));
    } else {
      dispatch(signin(form, navigate));
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const googleSuccess = (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const result = jwtDecode(token); 

      const profile = {
        googleId: result.sub,
        name: result.name,
        email: result.email,
        imageUrl: result.picture,
      };

      dispatch({ type: AUTH, data: { result: profile, token } });
      navigate('/');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const googleError = () => {
    console.log('Google Sign In was unsuccessful. Try again later');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Typography>

          <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={6}
            sx={{
              mt: 1,
              p: { xs: 2, sm: 3 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              borderRadius: 3,
            }}
          >
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Input
                      name="firstName"
                      label="First Name"
                      handleChange={handleChange}
                      autoFocus
                      half
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Input
                      name="lastName"
                      label="Last Name"
                      handleChange={handleChange}
                      half
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Input
                  name="email"
                  label="Email Address"
                  handleChange={handleChange}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  name="password"
                  label="Password"
                  handleChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  handleShowPassword={handleShowPassword}
                />
              </Grid>
              {isSignup && (
                <Grid item xs={12}>
                  <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    handleChange={handleChange}
                    type="password"
                  />
                </Grid>
              )}
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 1 }}
            >
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  height: 1,
                  bgcolor: 'grey.300',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  marginTop: '-22px',
                }}
              >
                OR
              </Typography>
            </Box>

            <GoogleLogin
              onSuccess={googleSuccess}
              onError={googleError}
              theme="outline"
              size="large"
              text="signin_with"
              shape="rectangular"
              width="100%"
            />

            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
              <Button size="small" color="primary" onClick={() => navigate('/posts')}>
                Back to Posts
              </Button>
              <Button size="small" color="primary" onClick={switchMode}>
                {isSignup
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </GoogleOAuthProvider>
  );
};

export default Auth;