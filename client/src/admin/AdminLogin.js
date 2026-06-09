import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { setAuthState } = useContext(AuthContext);
  let navigate = useNavigate();

  const handleLogin = async () => {
    const data = { email: email, password: password };
    try {
      const response = await axios.post('http://localhost:8080/auth/admin-login', data);

      if (response.data.error) {
        setShowAlert(true);
        setAlertMessage(response.data.error);
      } else {
        localStorage.setItem('accessToken2', response.data.token);
        setAuthState({
          email: response.data.email,
          user_id: response.data.user_id,
          status: true,
        });
        setShowSuccessSnackbar(true);
        setShowSuccessAlert(true);

        setTimeout(() => {
          navigate('/admin');
        }, 5000);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Admin Login
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        sx={{ width: '100%', mt: 1 }}
      >
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& label.Mui-focused': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& label.Mui-focused': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'black',
            },
          }}
        />

        <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
          <MuiAlert elevation={6} variant="filled" onClose={() => setShowAlert(false)} severity="error">
            {alertMessage}
          </MuiAlert>
        </Snackbar>

        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={5000}
          onClose={() => setShowSuccessAlert(false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setShowSuccessAlert(false)}
            severity="success"
          >
            Login successful! Redirecting...
          </MuiAlert>
        </Snackbar>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
          }}
        >
          Login
        </Button>
      </form>
    </Container>
  );
};

export default AdminLogin;
