import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import LinkIcon from '@mui/icons-material/Link';

const Header = () => {
  let navigate = useNavigate();

  const drawerWidth = 240;

  const headerStyle = {
    appBar: {
      zIndex: 1201,
      backgroundColor: '#424242',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      zIndex: 1200,
    },
    drawerPaper: {
      width: drawerWidth,
      marginTop: '64px',
    },
    icons: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
    },
  };

  const [authState, setAuthState] = useState({
    email: '',
    user_id: 0,
    status: false,
  });

  const [logoutSnackbarOpen, setLogoutSnackbarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('accessToken2');
    setAuthState({
      email: '',
      user_id: 0,
      status: false,
    });
    setLogoutSnackbarOpen(true);

    setTimeout(() => {
      navigate("/admin/login");
    }, 5000);
  };

  const handleSnackbarClose = () => {
    setLogoutSnackbarOpen(false);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" style={headerStyle.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Phisherman
          </Typography>
          <div style={headerStyle.icons}>
            <IconButton color="inherit" style={{ marginRight: '10px' }} component={Link} to="/admin/profile">
              <AccountCircleIcon />
            </IconButton>
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        style={headerStyle.drawer}
        variant="permanent"
        anchor="left"
        classes={{
          paper: headerStyle.drawerPaper,
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/admin">
            <AnalyticsIcon style={{ marginRight: '10px' }} />
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/admin/user">
            <PeopleIcon style={{ marginRight: '10px' }} />
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} to="/admin/phishurl">
            <LinkIcon style={{ marginRight: '10px' }} />
            <ListItemText primary="Phish URL" />
          </ListItem>
        </List>
      </Drawer>
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
    </>
  );
};

export default Header;
