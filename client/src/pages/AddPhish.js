import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Grid, Paper, Typography, TextField, Button, Container, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    createTheme,
    ThemeProvider,
} from '@mui/material/styles';

function AddPhish() {
    const [url, setUrl] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { setAuthState } = useContext(AuthContext);
    const [userid_console, setUserid_console] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/login");
        }
        else {
            fetchUserData(accessToken);
        }
    }, [navigate]);

    const fetchUserData = async (accessToken) => {
        try {
            const response = await axios.get("http://localhost:8080/auth/user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const user_id = response.data.user_id;
            setUserid_console(user_id);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const submitUrl = () => {
        if (!validateFields()) {
            setShowAlert(true);
            setAlertMessage("Please enter a valid URL");
            return;
        }

        const data = { urlToUpload: url, user_id: userid_console };
        axios.post("http://localhost:8080/api/upload", data).then((response) => {
            if (response.data.error) {
                setShowAlert(true);
                setAlertMessage(response.data.error);
            } else {
                // URL submitted successfully
                setShowSuccessSnackbar(true);
                setAlertMessage(response.data.message);
                setTimeout(() => {
                    // Reload the current page
                    window.location.reload();
                }, 3000);
            }
        });
    };


    const validateFields = () => {
        return url.trim() !== "";
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submitUrl();
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
                            <Grid item sm={12}>
                                <ThemeProvider theme={theme}>
                                    <Typography variant="h3" sx={{ color: 'white', marginTop: '100px', marginRight: '30px', textAlign: 'center' }}>
                                        Upload the Phish URL
                                    </Typography>
                                </ThemeProvider>
                            </Grid>

                            <Grid item sm={12} sx={{ marginTop: '100px', marginBottom: '100px' }}>
                                <Paper elevation={3} style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h5">Add a Phish URL</Typography>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="URL"
                                        onChange={(event) => setUrl(event.target.value)}
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
                                        onClose={() => setShowSuccessSnackbar(false)}
                                    >
                                        <MuiAlert
                                            elevation={6}
                                            variant="filled"
                                            onClose={() => setShowSuccessSnackbar(false)}
                                            severity="success"
                                        >
                                            URL submitted successfully!
                                        </MuiAlert>
                                    </Snackbar>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        style={{
                                            marginTop: 50,
                                            width: '100%',
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                            },
                                        }}
                                    >
                                        Submit
                                    </Button>
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

export default AddPhish;
