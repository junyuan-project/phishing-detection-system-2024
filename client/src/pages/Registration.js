import React, { useState,  useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Paper, Typography, TextField, Button, Container, Snackbar } from "@mui/material";
import Link from "@mui/material/Link";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MuiAlert from "@mui/material/Alert";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Registration() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            navigate("/");
        }
    }, [navigate]);

    const isValidEmail = (email) => {
        // Use a regular expression for basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        // Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        if (!validateFields()) {
            setShowAlert(true);
            return;
        }

        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }

        if (!isValidEmail(email)) {
            setShowAlert(true);
            setAlertMessage("Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            setShowAlert(true);
            setAlertMessage(
                "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols."
            );
            return;
        }

        setIsSubmitting(true);

        
        const role = 'User';

        const data = { username, email, phoneNum, password, confirmPass, role };

        try {
            const response = await axios.post("http://localhost:8080/auth", data);
            console.log(response.data);

            setShowSuccessAlert(true);
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } catch (error) {
            console.error("Error during registration:", error);

            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || "An error occurred during registration.";
                setShowAlert(errorMessage);
                setAlertMessage(errorMessage);
            } else {
                setShowAlert("An error occurred during registration.");
                setAlertMessage("An error occurred during registration.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateFields = () => {
        return (
            username.trim() !== "" &&
            email.trim() !== "" &&
            phoneNum.trim() !== "" &&
            password.trim() !== "" && 
            confirmPass.trim() !== ""
        );
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
                    <Grid container>
                        <Grid item xs={12} sm={6} style={{ paddingRight: '10px' }}>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h3" sx={{ color: 'white', marginTop: '50%', marginRight: '30px', textAlign: 'right' }}>
                                    Join us on the Road of <br />Finding Phishing
                                </Typography>
                            </ThemeProvider>
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ marginTop: '100px', marginBottom: '100px' }}>
                            <Paper elevation={3} style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography variant="h5">Registration</Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Username"
                                        onChange={(event) => setUsername(event.target.value)}
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
                                        label="Phone Number"
                                        onChange={(event) => setPhoneNum(event.target.value)}
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
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            setPasswordError("");
                                        }}
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
                                        label="Confirm Password"
                                        type="password"
                                        onChange={(event) => {
                                            setConfirmPass(event.target.value);
                                            setPasswordError("");
                                        }}
                                        sx={{
                                            '& label.Mui-focused': {
                                                color: 'black',
                                            },
                                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                            },
                                        }}
                                    />

                                    {/* Alert for empty fields or mismatched passwords */}
                                    <Snackbar
                                        open={showSuccessAlert}
                                        autoHideDuration={5000}
                                        onClose={() => setShowSuccessAlert(false)}
                                    >
                                        <MuiAlert
                                            elevation={6}
                                            variant="filled"
                                            onClose={() => setShowSuccessAlert(false)}
                                            severity="success"
                                        >
                                            Registration successful! Redirecting to login...
                                        </MuiAlert>
                                    </Snackbar>

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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit" 
                                        style={{
                                            marginTop: 30,
                                            width: '100%',
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                            },
                                        }}
                                        disabled={isSubmitting} 
                                    >
                                        Register
                                    </Button>
                                </form>

                                <Grid container sx={{ marginTop: '10px' }}>
                                    <Grid item>
                                        <Link
                                            href="/login"
                                            variant="body2"
                                            sx={{ textDecoration: 'none', color: 'black', '&:hover': { textDecoration: 'underline' } }}
                                        >
                                            {"Already have an account? Log In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            <Footer />
        </>
    );
}

export default Registration;
