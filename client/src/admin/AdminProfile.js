import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Toolbar,
    Grid,
    Button,
    TextField,
    Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

const AdminProfile = () => {
    const [username, setUsername] = useState('');
    const [username2, setUsername2] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const contentStyle = {
        flexGrow: 1,
        padding: '20px',
        marginLeft: '50px',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken2');

                if (!accessToken) {
                    navigate('/admin/login');
                } else {
                    try {
                        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                        const userRole = decodedToken.role;

                        if (userRole !== 'Admin') {
                            navigate('/admin/login');
                        } else {
                            const response = await axios.get('http://localhost:8080/auth/user', {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            });

                            const userData = response.data;
                            setUsername(userData.username);
                            setUsername2(userData.username);
                            setEmail(userData.email);
                            setPhoneNumber(userData.phoneNumber);
                            setRole(userData.role);
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        navigate('/admin/login');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    const handleEditProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken2');

            await axios.put(
                'http://localhost:8080/auth/edit',
                {
                    username,
                    email,
                    phoneNum: phoneNumber,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log('Profile updated successfully.');
            setSnackbarMessage('User information updated successfully.');
            setSnackbarOpen(true);
            setTimeout(() => {
                window.location.reload();
            }, 5000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setSnackbarMessage(error);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#f5f5f5', height: '750px' }}>
                <main style={contentStyle}>
                    <Toolbar />
                    <Container>
                        <Typography variant="h5" gutterBottom marginTop={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                            Account
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Paper style={{ padding: '20px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <img
                                        src="../usericon.png"
                                        alt="Profile"
                                        style={{ width: '200px', borderRadius: '50%' }}
                                    />
                                    <Typography fontWeight={'bold'} fontSize={'1.3rem'}>{username2}</Typography>
                                    <Typography color={'grey'}>{role}</Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Paper style={{ padding: '20px', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)' }}>
                                    <Typography fontWeight={'bold'} fontSize={'1.2rem'} textAlign={'left'}>Profile</Typography>
                                    <Typography color={'grey'} fontSize={'0.9rem'} textAlign={'left'}>The information can be edited</Typography>
                                    <TextField
                                        label="Username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        fullWidth
                                        margin="normal"
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
                                        label="Email"
                                        name="email"
                                        value={email}
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            '& label.Mui-focused': {
                                                color: 'black',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                        }}
                                        disabled
                                    />
                                    <TextField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                        sx={{
                                            '& label.Mui-focused': {
                                                color: 'black',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                        }}
                                    />
                                    <Button variant="contained" onClick={handleEditProfile} style={{ backgroundColor: 'black', marginTop: '20px', marginLeft: 'auto', display: 'block' }}>
                                        Submit
                                    </Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </main>
            </div>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="success"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </>
    );
};

export default AdminProfile;
