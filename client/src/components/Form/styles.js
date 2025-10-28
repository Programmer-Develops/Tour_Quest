
import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    '& .MuiTextField-root': {
      margin: '0.25rem', // Equivalent to theme.spacing(1)
    },
  },
  paper: {
    padding: '0.5rem', // Equivalent to theme.spacing(2)
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
}));
