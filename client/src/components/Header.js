import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Tab,
    Tabs,
    useMediaQuery,
    useTheme,
    Snackbar,
} from '@mui/material';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import DrawerComp from './DrawerComp';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const Header = () => {
    const theme = useTheme();
    const isMatch = useMediaQuery(theme.breakpoints.down('md'));
    let navigate = useNavigate();

    const [authState, setAuthState] = useState({
        email: '',
        user_id: 0,
        status: false,
    });

    const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

    useEffect(() => {
        axios
            .get('http://localhost:8080/auth/auth', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            })
            .then((response) => {
                if (response.data.error) {
                    setAuthState({ ...authState, status: false });
                } else {
                    setAuthState({
                        email: response.data.email,
                        user_id: response.data.user_id,
                        status: true,
                    });
                }
            });
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAuthState({
            email: '',
            user_id: 0,
            status: false,
        });
        setLogoutSnackbarOpen(true);

        setTimeout(() => {
            navigate("/login");
        }, 5000);
    };

    const handleSnackbarClose = () => {
        setLogoutSnackbarOpen(false);
    };

    return (
        <div>
            <React.Fragment>
                <AppBar position="static" sx={{ background: 'white' }} elevation={0}>
                    <Toolbar>
                        {isMatch ? (
                            <>
                                <DrawerComp />
                                <div style={{ textAlign: 'left' }}>
                                    <Link to="/">
                                        <img
                                            src="/phisherman_2.png"
                                            alt="Logo"
                                            style={{ width: '25%', }}
                                        />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/">
                                    <img
                                        src="/phisherman_1.png"
                                        alt="Logo"
                                        style={{ width: '20px', padding: '0px 0px 5px 0px', cursor: 'pointer' }}
                                    />
                                </Link>
                                <Tabs>
                                    <Tab
                                        label="Verify a Phish" href="/"
                                        sx={{ color: 'black', marginLeft: '10px' }}
                                    />
                                    <Tab label="Add a Phish" href="../addphish" sx={{ color: 'black' }} />
                                    <Tab label="Phish Search" href="../searchphish" sx={{ color: 'black' }} />
                                    <Tab label="Email Detection" href="../emaildetection" sx={{ color: 'black' }} />
                                </Tabs>
                                {!authState.status ? (
                                    <>
                                        <Button
                                            color="inherit"
                                            variant="text"
                                            href="../login"
                                            sx={{ color: 'black', marginLeft: 'auto' }}
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            color="inherit"
                                            variant="contained"
                                            href="../registration"
                                            sx={{ background: 'black', color: 'white', marginLeft: '10px', '&:hover': { background: 'darkgrey' } }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            color="inherit"
                                            variant="text"
                                            href="../profile"
                                            sx={{ color: 'black', marginLeft: 'auto' }}
                                        >
                                            Profile
                                        </Button>
                                        <Button
                                            color="inherit"
                                            variant="contained"
                                            onClick={logout}
                                            sx={{ background: 'black', color: 'white', marginLeft: '10px', '&:hover': { background: 'darkgrey' } }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </Toolbar>
                </AppBar>
                <Snackbar
                    open={logoutSnackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={handleSnackbarClose}
                        severity="success"
                    >
                        Logout successful
                    </MuiAlert>
                </Snackbar>
            </React.Fragment>
        </div>
    );
};

export default Header;
