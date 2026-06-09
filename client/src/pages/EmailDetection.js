import React, { useState } from "react";
import axios from "axios";
import {
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    Container,
    Snackbar,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function EmailDetection() {
    const [email, setEmail] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const submitEmail = () => {
        if (!validateFields()) {
            setShowAlert(true);
            setAlertMessage("Please enter a valid Email Address");
            return;
        }

        setLoading(true);

        const data = { email: email };
        axios
            .post("http://localhost:8080/email/verify-email", data)
            .then((response) => {
                setLoading(false);

                console.log(response.data);

                if (response.data.valid) {
                    setShowSuccessSnackbar(true);
                    setAlertMessage("Email is valid!");
                } else {
                    setShowAlert(true);
                    setAlertMessage("Email is not valid. Please enter a valid email address.");
                }
            })
            .catch((error) => {
                setLoading(false);

                console.error("Error verifying email:", error);
                setShowAlert(true);
                setAlertMessage("Error verifying email. Please try again.");
            });
    };

    const validateFields = () => {
        return email.trim() !== "";
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submitEmail();
    };

    const theme = createTheme({
        typography: {
            fontFamily: ['"Segoe UI Emoji"'].join(","),
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
                                    <Typography
                                        variant="h3"
                                        sx={{ color: "white", marginTop: "100px", marginRight: "30px", textAlign: "center" }}
                                    >
                                        Email Detection
                                    </Typography>
                                </ThemeProvider>
                            </Grid>

                            <Grid item sm={12} sx={{ marginTop: "100px", marginBottom: "100px" }}>
                                <Paper elevation={3} style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h5">Add an Email Address</Typography>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        label="Email Address"
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
                                    <Snackbar open={showAlert} autoHideDuration={5000} onClose={() => setShowAlert(false)}>
                                        <MuiAlert elevation={6} variant="filled" onClose={() => setShowAlert(false)} severity="error">
                                            {alertMessage}
                                        </MuiAlert>
                                    </Snackbar>

                                    <Snackbar open={showSuccessSnackbar} autoHideDuration={5000} onClose={() => setShowSuccessSnackbar(false)}>
                                        <MuiAlert elevation={6} variant="filled" onClose={() => setShowSuccessSnackbar(false)} severity="success">
                                            {alertMessage}
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
                                    {loading && (
                                        <Backdrop
                                            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                            open={loading}
                                        >
                                            <CircularProgress color="primary" />
                                        </Backdrop>
                                    )}
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
export default EmailDetection;
