import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Grid, Paper, Typography, TextField, Button, Container, Snackbar } from "@mui/material";
import Link from "@mui/material/Link";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MuiAlert from "@mui/material/Alert";
import {
    createTheme,
    ThemeProvider,
} from '@mui/material/styles';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        // Check if the access token exists in local storage
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            // Redirect to the home page or another page of your choice
            navigate("/");
        }
    }, [navigate]);

    const login = () => {
        if (!validateFields()) {
            setShowAlert(true);
            setAlertMessage("Please enter both email and password");
            return;
        }

        const data = { email: email, password: password };
        axios.post("http://localhost:8080/auth/login", data).then((response) => {
            if (response.data.error) {
                setShowAlert(true);
                setAlertMessage(response.data.error);
                console.log(response.data.error);
            } else {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                    email: response.data.email,
                    user_id: response.data.user_id,
                    status: true,
                });
                setShowSuccessSnackbar(true);

                setShowSuccessAlert(true);

                setTimeout(() => {
                    navigate("/");
                }, 5000);
            }
        });
    };

    const validateFields = () => {
        return email.trim() !== "" && password.trim() !== "";
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    };

    const theme = createTheme({
        typography: {
            fontFamily: [
                '"Segoe UI Emoji"',
            ].join(','),
        },
    });

    return (
        <>
            <Header />

            <div style={{ backgroundColor: "black", width: "100%", zIndex: -1 }}>
                <Container component="main" maxWidth="md">
                    <form onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item xs={12} sm={6} style={{ paddingRight: '10px' }}>
                                <ThemeProvider theme={theme}>
                                    <Typography variant="h3" sx={{ color: 'white', marginTop: '40%', marginRight: '30px', textAlign: 'right' }}>Start the Road <br />of <br />Finding Phishing</Typography>
                                </ThemeProvider>
                            </Grid>

                            <Grid item xs={12} sm={6} sx={{ marginTop: '100px', marginBottom: '100px' }}>
                                <Paper elevation={3} style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h5">Login</Typography>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Email"
                                        onChange={(event) => setEmail(event.target.value)}
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
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        onChange={(event) => setPassword(event.target.value)}
                                        sx={{
                                            '& label.Mui-focused': {
                                                color: 'black',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                        }}
                                    />
                                    <Snackbar
                                        open={showAlert}
                                        autoHideDuration={5000}
                                        onClose={() => setShowAlert(false)}
                                    >
                                        <MuiAlert
                                            elevation={6}
                                            variant="filled"
                                            onClose={() => setShowAlert(false)}
                                            severity="error"
                                        >
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
                                        color="primary"
                                        style={{
                                            marginTop: 30,
                                            width: '100%',
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                            },
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Grid container sx={{ marginTop: '10px' }}>
                                        <Grid item>
                                            <Link
                                                href="/registration"
                                                variant="body2"
                                                sx={{ textDecoration: 'none', color: 'black', '&:hover': { textDecoration: 'underline' } }}
                                            >
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </div>

            <Footer />
        </>
    );
}

export default Login;
