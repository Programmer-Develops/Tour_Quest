import { styled } from '@mui/material/styles';
import { AppBar, Typography } from '@mui/material';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  borderRadius: 15,
  margin: '30px 0',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyledHeading = styled(Typography)(({ theme }) => ({
  color: 'rgba(0,183,255, 1)',
}));

export const StyledImage = styled('img')({
  marginLeft: '15px',
});
