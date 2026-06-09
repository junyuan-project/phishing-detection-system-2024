import React, { useState, useEffect } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Button,
    Snackbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const DrawerComp = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

    const [authState, setAuthState] = useState({
        email: '',
        user_id: 0,
        status: false,
    });

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
    };

    const handleSnackbarClose = () => {
        setLogoutSnackbarOpen(false);
    };

    return (
        <React.Fragment>
            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <List style={{ flexDirection: 'column' }}>
                    <ListItemButton>
                        <Button color="inherit" href="../">
                            <img
                                src="/phisherman_2.png"
                                alt="Logo"
                                style={{ width: '130px', height: '10%', marginBottom: '20px', marginTop: '10px' }}
                            />
                        </Button>
                    </ListItemButton>
                    <ListItemButton>
                        <Button color="inherit" href="../">
                            Verify a Phish
                        </Button>
                    </ListItemButton>
                    <ListItemButton>
                        <Button color="inherit" href="../addphish">
                            Add a Phish
                        </Button>
                    </ListItemButton>
                    <ListItemButton>
                        <Button color="inherit" href="../searchphish">
                            Phish Search
                        </Button>
                    </ListItemButton>
                    <ListItemButton>
                        <Button color="inherit" href="../emaildetection">
                            Email Detection
                        </Button>
                    </ListItemButton>
                    {!authState.status ? (
                        <>
                            <ListItemButton>
                                <Button color="inherit" href="../login">
                                    Login
                                </Button>
                            </ListItemButton>
                            <ListItemButton>
                                <Button color="inherit" href="../registration">
                                    Sign Up
                                </Button>
                            </ListItemButton>
                        </>
                    ) : (
                        <>
                            <ListItemButton>
                                <Button color="inherit" href="../profile">
                                    Profile
                                </Button>
                            </ListItemButton>
                            <ListItemButton>
                                <Button color="inherit" onClick={logout}>
                                    Logout
                                </Button>
                            </ListItemButton>
                        </>
                    )}
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                <MenuIcon />
            </IconButton>

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
                    Logout successful!
                </MuiAlert>
            </Snackbar>
        </React.Fragment>
    );
};

export default DrawerComp;
